import type Quill from 'quill';
import type { Range } from 'quill';

export interface MenuItems {
  name: string;
  alias: string[];
  icon: string;
  title: string;
  descriptions?: string;
  handler: (this: Quill, item: MenuItems, range: Range | null, options?: any) => void;
}

export interface QuillQuickInsertOptions {
  menuItems: MenuItems[];
}
