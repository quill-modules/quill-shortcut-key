import type Quill from 'quill';
import type { Range } from 'quill';

export interface MenuItems {
  type: 'item';
  name: string;
  alias: string[];
  icon?: string;
  title: string;
  descriptions?: string;
  handler: (this: Quill, item: MenuItems, range: Range | null, options?: any) => void;
}
export interface MenuItemsGroup {
  type: 'group';
  icon?: string;
  title: string;
  descriptions?: string;
  children: MenuItems[];
}
export type Menu = (MenuItems | MenuItemsGroup)[];

export interface QuillShortcutKeyInputOptions extends Omit<QuillShortcutKeyOptions, 'menuItems'> {
  menuItems: ((Omit<MenuItems, 'type'> & { type?: 'item' }) | MenuItemsGroup)[];
}

export interface QuillShortcutKeyOptions {
  menuItems: (MenuItems | MenuItemsGroup)[];
  placeholder: string;
}
