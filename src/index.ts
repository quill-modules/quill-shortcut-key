import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block';
import type TypeBlock from 'quill/blots/block';
import type { Menu, MenuExportItem, MenuItemData, MenuItems, MenuItemsGroup, QuillQuickInsertInputOptions, QuillQuickInsertOptions } from './utils';
import Quill from 'quill';
import { createBEM, createMenu, SearchIndex, throttle } from './utils';

const Parchment = Quill.import('parchment');

export class QuillQuickInsert {
  bem = createBEM('qsf', 'menu');
  options: QuillQuickInsertOptions;
  menuSorter: (searchText: string) => Menu;
  currentMenu: Menu;
  menuContainer?: HTMLElement;
  currentMenuContainer?: HTMLElement;
  selectedItemIndex: number = -1;

  constructor(public quill: Quill, options: Partial<QuillQuickInsertInputOptions>) {
    this.options = this.resolveOptions(options);
    this.currentMenu = this.options.menuItems;
    this.menuSorter = this.createMenuItemsSorter(this.options.menuItems);

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

  resolveOptions(options: Partial<QuillQuickInsertInputOptions>): QuillQuickInsertOptions {
    const result = Object.assign({
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

        const iconWrap = document.createElement('div');
        iconWrap.classList.add(this.bem.be('item-icon'));
        const icon = document.createElement('div');
        icon.classList.add(this.bem.be('icon'));
        icon.innerHTML = item.icon;
        iconWrap.appendChild(icon);

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

        itemContent.appendChild(iconWrap);
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

    this.selectedItemIndex = -1;
    if (this.menuContainer) {
      this.menuContainer.innerHTML = '';
    }
    else {
      this.menuContainer = document.createElement('div');
      this.menuContainer.classList.add(this.bem.be('container'));
      this.quill.root.addEventListener('keydown', this.handleMenuControl, true);
      this.quill.root.addEventListener('click', this.destroyMenuList);
      this.menuContainer.addEventListener('mousemove', this.resetMenuSelected);
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
    this.currentMenuContainer = this.menuContainer;
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

  // eslint-disable-next-line unicorn/consistent-function-scoping
  handleMenuControl = throttle((e: KeyboardEvent) => {
    const handleKey = new Set(['Escape', 'Enter', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']);
    if (handleKey.has(e.code)) {
      e.stopImmediatePropagation();
      e.preventDefault();
      if (this.selectedItemIndex !== -1) {
        switch (e.code) {
          // TODO: expand sub menu
          case 'ArrowLeft': {
            break;
          }
          case 'ArrowRight': {
            break;
          }
        }
      }

      switch (e.code) {
        case 'Enter': {
          const item = this.getSelectedMenuItem();
          if (item) {
            item.click();
          }
          return;
        }
        case 'Escape': {
          this.destroyMenuList();
          return;
        }
        case 'ArrowDown': {
          this.selectedItemIndex += 1;
          this.selectedItemIndex %= this.currentMenu.length;
          break;
        }
        case 'ArrowUp': {
          this.selectedItemIndex -= 1;
          if (this.selectedItemIndex < 0) {
            this.selectedItemIndex = this.currentMenu.length - 1;
          }
          break;
        }
      }

      this.setMenuSelected();
    }
  }, 50);

  getSelectedMenuItem() {
    if (!this.currentMenuContainer) return null;
    const selected = this.currentMenuContainer.querySelector(`.${this.bem.is('selected')}`) as MenuExportItem;
    if (selected) {
      return selected;
    }
    const items = Array.from(this.currentMenuContainer.querySelectorAll(`.${this.bem.be('item')}`)) as MenuExportItem[];
    const item = this.selectedItemIndex === -1 ? items[0] : items[this.selectedItemIndex];
    if (item) {
      return item;
    }
    return null;
  }

  resetMenuSelected = () => {
    this.selectedItemIndex = -1;
  };

  setMenuSelected() {
    if (this.menuContainer) {
      for (const el of Array.from(this.menuContainer.querySelectorAll(`.${this.bem.is('selected')}`))) {
        el.classList.remove(this.bem.is('selected'));
      }
      if (this.selectedItemIndex >= 0) {
        const el = this.menuContainer.querySelectorAll(`.${this.bem.be('item')}`)[this.selectedItemIndex] as HTMLElement;
        if (el) {
          el.classList.add(this.bem.is('selected'));

          const containerRect = this.menuContainer.getBoundingClientRect();
          const itemRect = el.getBoundingClientRect();

          const isItemBelow = itemRect.bottom > containerRect.bottom;
          const isItemAbove = itemRect.top < containerRect.top;
          if (isItemBelow) {
            // 底部对齐
            this.menuContainer.scrollTop = el.offsetTop - this.menuContainer.clientHeight + itemRect.height;
          }
          else if (isItemAbove) {
            // 顶部对齐
            this.menuContainer.scrollTop = el.offsetTop;
          }

          return true;
        }
      }
    }
    return false;
  }

  destroyMenuList = () => {
    this.quill.root.removeEventListener('keydown', this.handleMenuControl, true);
    this.quill.root.removeEventListener('click', this.destroyMenuList);
    if (!this.menuContainer) return;
    this.menuContainer.removeEventListener('mousemove', this.resetMenuSelected);
    this.menuContainer.remove();
    this.menuContainer = undefined;
  };
}

export { defaultMenuItems } from './utils';
export default QuillQuickInsert;
