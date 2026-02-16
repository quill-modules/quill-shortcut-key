import type Quill from 'quill';
import type { Range } from 'quill';

export interface QuillShortcutKeyInstance {
  quill: Quill;
  options: QuillShortcutKeyOptions;
}

export interface SearchIndexInput {
  name: string;
  alias?: string[];
}
export interface MenuEventData {
  data: MenuItemData;
  index: number;
  item: HTMLElement;
}
export type MenuItemData = {
  type: 'item';
  icon?: string;
  text?: string;
  content?: () => HTMLElement;
  children?: MenuItemData[];
  classes?: string[];
  onHover?: (data: MenuEventData) => void;
  onClick?: (data: MenuEventData) => void;
  onClose?: (data: MenuEventData) => void;
  onOpen?: (data: MenuEventData) => void;
} | {
  type: 'break';
  classes?: string[];
};
export interface MenuCommonOptions extends SearchIndexInput {
  hideSearch?: boolean;
  icon?: string;
  title?: string | ((this: QuillShortcutKeyInstance) => string);
  descriptions?: string | ((this: QuillShortcutKeyInstance) => string);
  content?: () => HTMLElement;
  classes?: string[];
  onClick?: (this: Quill, range: Range | null, data: MenuEventData) => void;
  onCloseSub?: (this: Quill, data: MenuEventData) => void;
  onOpenSub?: (this: Quill, data: MenuEventData) => void;
}
export interface MenuItems extends MenuCommonOptions {
  type: 'item';
}
export interface MenuItemsGroup extends MenuCommonOptions {
  type: 'group';
  children: Menu;
}
export type Menu = (MenuItems | MenuItemsGroup)[];

export interface QuillShortcutKeyInputOptions extends Omit<QuillShortcutKeyOptions, 'menuItems'> {
  menuItems: ((Omit<MenuItems, 'type'> & { type?: 'item' }) | MenuItemsGroup)[];
}

export interface QuillShortcutKeyOptions {
  menuItems: Menu;
  placeholder: string | ((this: QuillShortcutKeyInstance) => string);
  menuKeyboardControls: (event: KeyboardEvent, data: { currentMenu: HTMLElement; selectedIndex: number }) => boolean;
}
