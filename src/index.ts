import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block';
import type TypeBlock from 'quill/blots/block';
import type { MenuItems } from './utils';
import Quill from 'quill';
import { createBEM, createMenu, SearchIndex } from './utils';

export interface QuillQuickInsertOptions {
  menuItems: MenuItems[];
}
export class QuillQuickInsert {
  bem = createBEM('qsf', 'menu');
  options: QuillQuickInsertOptions;
  menuSorter: (searchText: string) => MenuItems[];
  menuContainer?: HTMLElement;

  constructor(public quill: Quill, options: Partial<QuillQuickInsertOptions>) {
    this.options = this.resolveOptions(options);

    this.menuSorter = this.createMenuItemsSorter(this.options.menuItems);
    this.quill.on(Quill.events.EDITOR_CHANGE, () => {
      const range = this.quill.getSelection();
      if (range) {
        const [line, offset] = this.quill.getLine(range.index);
        if (line) {
          const text = this.quill.getText(range.index - offset, range.index - offset + line.length());
          const matchString = text.match(/^\/(.+)/);
          if (text.startsWith('/') && matchString) {
            const matchItems = this.menuSorter(matchString[1]);
            this.generateMenuList(matchItems, line);
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

  generateMenuList(items: MenuItems[], relativeLine: TypeBlock | TypeBlockEmbed) {
    const content = createMenu(items.map((item) => {
      return {
        type: 'item',
        content: () => {
          const itemContent = document.createElement('div');
          itemContent.classList.add(this.bem.be('item'));

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

    if (this.menuContainer) {
      this.menuContainer.innerHTML = '';
    }
    else {
      this.menuContainer = document.createElement('div');
      this.menuContainer.classList.add(this.bem.be('container'));
      document.body.appendChild(this.menuContainer);
    }

    const lineRect = relativeLine.domNode.getBoundingClientRect();
    Object.assign(this.menuContainer.style, {
      left: `${lineRect.left}px`,
      top: `${lineRect.bottom}px`,
    });
    this.menuContainer.appendChild(content);
  }

  destroyMenuList() {
    if (!this.menuContainer) return;
    this.menuContainer.remove();
    this.menuContainer = undefined;
  }
}

export { defaultMenuItems } from './utils';
export default QuillQuickInsert;
