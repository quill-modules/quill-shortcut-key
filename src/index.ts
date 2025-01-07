import type { MenuItems } from './utils';
import Quill from 'quill';
import { SearchIndex } from './utils';

export interface QuillQuickInsertOptions {
  menuItems: MenuItems[];
}
export class QuillQuickInsert {
  options: QuillQuickInsertOptions;
  menuSorter: (searchText: string) => MenuItems[];

  constructor(public quill: Quill, options: Partial<QuillQuickInsertOptions>) {
    this.options = this.resolveOptions(options);

    this.menuSorter = this.createMenuItemsSorter(this.options.menuItems);
    this.quill.on(Quill.events.EDITOR_CHANGE, () => {
      const range = this.quill.getSelection();
      if (!range) return;
      const [line, offset] = this.quill.getLine(range.index);
      if (!line) return;
      const text = this.quill.getText(range.index - offset, range.index - offset + line.length());
      const match = text.match(/^\/(.+)/);
      if (!text.startsWith('/') || !match) return;
      console.log(this.menuSorter(match[1]).map(item => item.name));
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
}

export { defaultMenuItems } from './utils';
export default QuillQuickInsert;
