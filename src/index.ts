import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block';
import type TypeBlock from 'quill/blots/block';
import type { MenuItems, QuillQuickInsertOptions } from './utils';
import Quill from 'quill';
import { createBEM, createMenu, SearchIndex, throttle } from './utils';

const Parchment = Quill.import('parchment');

export class QuillQuickInsert {
  bem = createBEM('qsf', 'menu');
  options: QuillQuickInsertOptions;
  menuSorter: (searchText: string) => MenuItems[];
  currentMenu: MenuItems[];
  menuContainer?: HTMLElement;
  selectedItemIndex: number = -1;

  constructor(public quill: Quill, options: Partial<QuillQuickInsertOptions>) {
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

  resolveOptions(options: Partial<QuillQuickInsertOptions>) {
    return Object.assign({
      menuItems: [],
    }, options);
  }

  createMenuItemsSorter(items: MenuItems[]) {
    const searchIndex = new SearchIndex(items);
    return (searchText: string) => searchIndex.search(searchText);
  }

  generateMenuList(relativeLine: TypeBlock | TypeBlockEmbed, formats: Record<string, any>) {
    const content = createMenu(this.currentMenu.map((item) => {
      return {
        type: 'item',
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
          const itemContentHint = document.createElement('span');
          itemContentHint.classList.add(this.bem.be('item-hint'));
          itemContentHint.textContent = `/${item.name}`;
          itemContentTitle.appendChild(titleText);
          itemContentTitle.appendChild(itemContentHint);
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
          relativeLine.domNode.innerHTML = '';
          item.handler.call(this.quill, item.name);
          this.destroyMenuList();
        },
      };
    }));

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
    Object.assign(this.menuContainer.style, {
      left: `${rootRect.left + (formats.align === 'right' ? lineRect.width : 0)}px`,
      top: `${lineRect.bottom - rootRect.top}px`,
    });
    this.menuContainer.appendChild(content);
    // limit in viewport
    requestAnimationFrame(() => {
      if (!this.menuContainer) return;
      const rect = this.menuContainer.getBoundingClientRect();
      if (window.innerWidth < rect.right) {
        this.menuContainer.style.left = `${rect.left - rect.width}px`;
      }
      if (window.innerHeight < rect.bottom) {
        this.menuContainer.style.top = `${lineRect.top - rootRect.top - rect.height}px`;
      }
    });
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  handleMenuControl = throttle((e: KeyboardEvent) => {
    const handleKey = new Set(['Escape', 'Enter', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']);
    if (handleKey.has(e.code) && this.menuContainer) {
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
          const selected = this.menuContainer.querySelector(`.${this.bem.is('selected')}`) as HTMLElement;
          if (selected) {
            selected.click();
            return;
          }
          const items = Array.from(this.menuContainer.querySelectorAll(`.${this.bem.be('item')}`)) as HTMLElement[];
          const item = this.selectedItemIndex === -1 ? items[0] : items[this.selectedItemIndex];
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
