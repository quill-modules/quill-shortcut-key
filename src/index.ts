import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block';
import type TypeBlock from 'quill/blots/block';
import type { Menu, MenuItemData, MenuItems, MenuItemsGroup, QuillShortcutKeyInputOptions, QuillShortcutKeyOptions } from './utils';
import Quill from 'quill';
import { createBEM, createMenu, SearchIndex, setupMenuKeyboardControls } from './utils';

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
      }
    });
    this.quill.on(Quill.events.TEXT_CHANGE, () => {
      const range = this.quill.getSelection();
      if (range) {
        const [line, offset] = this.quill.getLine(range.index);
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
    });
  }

  resolveOptions(options: Partial<QuillShortcutKeyInputOptions>): QuillShortcutKeyOptions {
    const result = Object.assign({
      placeholder: 'Input / recall menu',
      menuItems: [] as any[],
    }, options);
    result.menuItems = result.menuItems.map((item) => {
      if (!item.type) {
        item.type = 'item';
      }
      return item;
    });
    return result;
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
    const list: MenuItems[] = [];
    for (const item of items) {
      if (item.type === 'group') {
        list.push(...item.children);
      }
      else {
        list.push(item);
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
        titleText.textContent = item.title;
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
      },
      onClick: () => {
        if (item.type === 'item') {
          relativeLine.domNode.innerHTML = '';
          const range = this.quill.getSelection();
          item.handler.call(this.quill, item, range);
          this.destroyMenuList();
        }
      },
    };
  }

  generateMenuList(relativeLine: TypeBlock | TypeBlockEmbed, formats: Record<string, any>) {
    const content = createMenu(this.currentMenu.map(item => this.generateMenuItem(relativeLine, item)));
    this.menuKeyboardControlsCleanup = setupMenuKeyboardControls(content, this.quill.root);

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
}

export { defaultMenuItems, defaultShortKey } from './utils';
export default QuillShortcutKey;
