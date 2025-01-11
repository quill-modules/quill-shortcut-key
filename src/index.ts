import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block';
import type TypeBlock from 'quill/blots/block';
import type { Menu, MenuItemData, MenuItems, MenuItemsGroup, QuillShortcutKeyInputOptions, QuillShortcutKeyOptions } from './utils';
import Quill from 'quill';
import { createBEM, createMenu, SearchIndex, throttle } from './utils';

const Parchment = Quill.import('parchment');

export class QuillShortcutKey {
  bem = createBEM('qsf', 'menu');
  options: QuillShortcutKeyOptions;
  menuSorter: (searchText: string) => Menu;
  currentMenu: Menu;
  menuContainer?: HTMLElement;
  menuKeyboardControlsCleanup?: () => void;

  constructor(public quill: Quill, options: Partial<QuillShortcutKeyInputOptions>) {
    this.options = this.resolveOptions(options);
    this.currentMenu = this.options.menuItems;
    this.menuSorter = this.createMenuItemsSorter(this.options.menuItems);

    this.placeholderDisplay();

    this.quill.on(Quill.events.COMPOSITION_START, () => {
      this.placeholderDisplay();
    });
    this.quill.on(Quill.events.EDITOR_CHANGE, (type: string) => {
      if (type === Quill.events.SELECTION_CHANGE) {
        this.placeholderDisplay();
        const range = this.quill.getSelection();
        if (range) {
          const [line, offset] = this.quill.getLine(range.index);
          console.log(range, line);
          if (line) {
            const lineStartIndex = range.index - offset;
            const lineEndIndex = lineStartIndex + line.length();
            const text = this.quill.getText(lineStartIndex, lineEndIndex);
            const formats = this.quill.getFormat(lineStartIndex, lineEndIndex);
            const isBlock = Object.keys(formats).some(format => this.quill.scroll.registry.query(format, Parchment.Scope.BLOCK_BLOT));
            if (text.startsWith('/') && !isBlock) {
              const matchString = text.match(/^\/(.+)/);
              if (matchString) {
                const matchItems = this.menuSorter(matchString[1]);
                this.currentMenu = matchItems;
              }
              else {
                this.currentMenu = this.options.menuItems;
              }
              this.generateMenuList(line, formats);
              return;
            }
          }
        }
        this.destroyMenuList();
      }
    });
  }

  resolveOptions(options: Partial<QuillShortcutKeyInputOptions>): QuillShortcutKeyOptions {
    return Object.assign({
      placeholder: 'Input / recall menu',
      menuItems: [] as any[],
      menuKeyboardControls: () => false,
    }, options);
  }

  placeholderDisplay() {
    const placeholders = Array.from(this.quill.root.querySelectorAll(':scope > p[data-placeholder]')) as HTMLElement[];
    for (const item of placeholders) {
      delete item.dataset.placeholder;
    }

    const range = this.quill.getSelection(true);
    if (range && range.length === 0) {
      const [line] = this.quill.getLine(range.index);
      if (line && line.length() === 1) {
        line.domNode.dataset.placeholder = this.options.placeholder;
      }
    }
  }

  createMenuItemsSorter(items: Menu) {
    const list: Menu[number][] = [];
    for (const item of items) {
      if (!item.hideSearch) {
        list.push(item);
      }
      if (item.type === 'group') {
        list.push(...item.children.filter(i => !i.hideSearch));
      }
    }
    const searchIndex = new SearchIndex(list);
    return (searchText: string) => searchIndex.search(searchText);
  }

  generateMenuItem(relativeLine: TypeBlock | TypeBlockEmbed, item: MenuItems | MenuItemsGroup): MenuItemData {
    return {
      type: 'item' as const,
      children: ((item as MenuItemsGroup).children || []).map(i => this.generateMenuItem(relativeLine, i)),
      content: () => {
        if (item.content) {
          return item.content();
        }
        else {
          const itemContent = document.createElement('div');
          itemContent.classList.add(this.bem.be('item-container'));

          if (item.icon) {
            const iconWrap = document.createElement('div');
            iconWrap.classList.add(this.bem.be('item-icon'));
            const icon = document.createElement('div');
            icon.classList.add(this.bem.be('icon'));
            icon.innerHTML = item.icon;
            iconWrap.appendChild(icon);
            itemContent.appendChild(iconWrap);
          }

          const itemContentMain = document.createElement('div');
          itemContentMain.classList.add(this.bem.be('item-content'));

          const itemContentTitle = document.createElement('div');
          itemContentTitle.classList.add(this.bem.be('item-title'));
          const titleText = document.createElement('span');
          titleText.textContent = item.title!;
          itemContentTitle.appendChild(titleText);

          if (item.type === 'item') {
            const itemContentHint = document.createElement('span');
            itemContentHint.classList.add(this.bem.be('item-hint'));
            itemContentHint.textContent = `/${item.name}`;
            itemContentTitle.appendChild(itemContentHint);
          }
          itemContentMain.appendChild(itemContentTitle);

          if (item.descriptions) {
            const itemContentDescriptions = document.createElement('div');
            itemContentDescriptions.classList.add(this.bem.be('item-descriptions'));
            itemContentDescriptions.textContent = item.descriptions;
            itemContentMain.appendChild(itemContentDescriptions);
          }

          itemContent.appendChild(itemContentMain);
          return itemContent;
        }
      },
      onClose: (data) => {
        if (item.onCloseSub) {
          item.onCloseSub.call(this.quill, data);
        }
      },
      onOpen: (data) => {
        if (item.onOpenSub) {
          item.onOpenSub.call(this.quill, data);
        }
      },
      onClick: (data) => {
        if (item.type === 'item') {
          relativeLine.domNode.innerHTML = '';
          this.destroyMenuList();
        }
        if (item.onClick) {
          const range = this.quill.getSelection();
          item.onClick.call(this.quill, range, data);
        }
      },
    };
  }

  generateMenuList(relativeLine: TypeBlock | TypeBlockEmbed, formats: Record<string, any>) {
    const content = createMenu(this.currentMenu.map(item => this.generateMenuItem(relativeLine, item)));
    if (this.menuKeyboardControlsCleanup) {
      this.menuKeyboardControlsCleanup();
    }
    this.menuKeyboardControlsCleanup = this.setupMenuKeyboardControls({
      wrapper: content,
      target: this.quill.root,
      menuControl: this.options.menuKeyboardControls,
    });

    if (this.menuContainer) {
      this.menuContainer.innerHTML = '';
    }
    else {
      this.menuContainer = document.createElement('div');
      this.menuContainer.classList.add(this.bem.be('container'));
      this.quill.root.addEventListener('click', this.destroyMenuList);
      this.quill.container.appendChild(this.menuContainer);
    }

    const rootRect = this.quill.root.getBoundingClientRect();
    const lineRect = relativeLine.domNode.getBoundingClientRect();
    const left = lineRect.left - rootRect.left + (formats.align === 'right' ? lineRect.width : 0);
    const top = lineRect.bottom - rootRect.top;
    Object.assign(this.menuContainer.style, {
      left: `${left}px`,
      top: `${top}px`,
    });
    this.menuContainer.appendChild(content);
    // limit in viewport
    requestAnimationFrame(() => {
      if (!this.menuContainer) return;
      const rect = this.menuContainer.getBoundingClientRect();
      if (window.innerWidth < rect.right) {
        this.menuContainer.style.left = `${left - rect.width}px`;
      }
      if (window.innerHeight < rect.bottom) {
        this.menuContainer.style.top = `${top - lineRect.height - rect.height}px`;
      }
    });
  }

  destroyMenuList = () => {
    this.quill.root.removeEventListener('click', this.destroyMenuList);
    if (this.menuKeyboardControlsCleanup) this.menuKeyboardControlsCleanup();
    if (!this.menuContainer) return;
    this.menuContainer.remove();
    this.menuContainer = undefined;
  };

  setupMenuKeyboardControls({ wrapper, target, menuControl }: {
    wrapper: HTMLElement;
    target: HTMLElement;
    menuControl: (event: KeyboardEvent, data: { currentMenu: HTMLElement; selectedIndex: number }) => boolean;
  }) {
    let currentMenu = wrapper;
    let parentMenu: HTMLElement | null = null;
    let selectedIndex = -1;

    const setSelected = (index: number) => {
      const items = Array.from(currentMenu.querySelectorAll(`.${this.bem.be('item')}`)) as HTMLElement[];
      for (const [i, item] of items.entries()) {
        if (i === index) {
          item.classList.add(this.bem.is('selected'));

          const containerRect = currentMenu.getBoundingClientRect();
          const itemRect = item.getBoundingClientRect();

          const isItemBelow = itemRect.bottom > containerRect.bottom;
          const isItemAbove = itemRect.top < containerRect.top;
          if (isItemBelow) {
            currentMenu.scrollTop = item.offsetTop - currentMenu.clientHeight + itemRect.height;
          }
          else if (isItemAbove) {
            currentMenu.scrollTop = item.offsetTop;
          }
        }
        else {
          item.classList.remove(this.bem.is('selected'));
        }
      }
      selectedIndex = index;
    };

    const handleKeyDown = throttle((event: KeyboardEvent) => {
      const items = currentMenu.querySelectorAll(`:scope > .${this.bem.be('item')}`);
      if (items.length === 0) {
        if (event.key === 'Enter') {
          event.preventDefault();
          this.destroyMenuList();
        }
        return;
      }

      const prevent = menuControl(event, { currentMenu, selectedIndex });
      if (prevent) return;

      switch (event.key) {
        case 'ArrowUp': {
          event.preventDefault();
          if (selectedIndex === -1) selectedIndex = 0;
          setSelected((selectedIndex - 1 + items.length) % items.length);
          break;
        }
        case 'ArrowDown': {
          event.preventDefault();
          setSelected((selectedIndex + 1) % items.length);
          break;
        }
        case 'ArrowRight': {
          event.preventDefault();
          const selectedItem = items[selectedIndex] as HTMLElement;
          if (!selectedItem) return;
          const hasSubMenu = selectedItem.dataset.hasChildren === 'true';
          if (hasSubMenu) {
            selectedItem.click();
            const subMenu = selectedItem.querySelector(`.${this.bem.b()}`) as HTMLElement;
            if (subMenu) {
              parentMenu = currentMenu;
              currentMenu = subMenu;
              setSelected(0);
            }
          }
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          if (parentMenu) {
            const parentIndex = Number.parseInt(currentMenu.dataset.parent || '0', 10);
            currentMenu = parentMenu;
            parentMenu = null;
            selectedIndex = parentIndex;
            setSelected(selectedIndex);
            const selectedItem = Array.from(currentMenu.querySelectorAll(`.${this.bem.be('item')}`))[selectedIndex] as HTMLElement;
            if (!selectedItem) return;
            selectedItem.dispatchEvent(new MouseEvent('mouseleave'));
          }
          break;
        }
        case 'Enter': {
          event.preventDefault();
          // default select first
          const selectedItem = items[Math.max(0, selectedIndex)] as HTMLElement;
          if (selectedItem) {
            selectedItem.click();
            if (selectedItem.dataset.hasChildren === 'true') {
              const subMenu = selectedItem.querySelector(`.${this.bem.b()}`) as HTMLElement;
              if (subMenu) {
                parentMenu = currentMenu;
                currentMenu = subMenu;
                setSelected(0);
              }
            }
          }
          break;
        }
      }
    }, 100);

    target.addEventListener('keydown', handleKeyDown, true);
    return () => {
      target.removeEventListener('keydown', handleKeyDown, true);
    };
  }
}

export { defaultMenuItems, defaultShortKey } from './utils';
export default QuillShortcutKey;
