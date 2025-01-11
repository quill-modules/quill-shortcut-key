import type Quill from 'quill';
import type { Range } from 'quill';

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
  title?: string;
  content?: () => HTMLElement;
  descriptions?: string;
  onClick?: (this: Quill, range: Range | null, data: MenuEventData) => void;
  onCloseSub?: (this: Quill, data: MenuEventData) => void;
  onOpenSub?: (this: Quill, data: MenuEventData) => void;
}
export interface MenuItems extends MenuCommonOptions {
  type: 'item';
}
export interface MenuItemsGroup extends MenuCommonOptions {
  type: 'group';
  children: MenuItems[];
}
export type Menu = (MenuItems | MenuItemsGroup)[];

export interface QuillShortcutKeyInputOptions extends Omit<QuillShortcutKeyOptions, 'menuItems'> {
  menuItems: ((Omit<MenuItems, 'type'> & { type?: 'item' }) | MenuItemsGroup)[];
}

export interface QuillShortcutKeyOptions {
  menuItems: (MenuItems | MenuItemsGroup)[];
  placeholder: string;
  menuKeyboardControls: (event: KeyboardEvent, data: { currentMenu: HTMLElement; selectedIndex: number }) => boolean;
}
