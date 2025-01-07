import type Quill from 'quill';

export interface MenuItems {
  name: string;
  alias: string[];
  icons: string;
  title: string;
  descriptions?: string;
  handler: (this: Quill, name: string, options: any) => void;
}
