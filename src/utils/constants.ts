import type { MenuItems } from './types';
import Quill from 'quill';

const icons = Quill.import('ui/icons') as Record<string, any>;
icons.header['1'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5 6l3-2v8"/></svg>`;
icons.header['2'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m9 12h-4c0-4 4-3 4-6c0-1.5-2-2.5-4-1"/></svg>`;
icons.header['3'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5.5 4.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2m-2 3.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>`;
icons.header['4'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18V6m5 4v3a1 1 0 0 0 1 1h3m0-4v8M4 12h8m-8 6V6"/></svg>`;
icons.header['5'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5 7v-3h4m-4 7.7c.4.2.8.3 1.3.3c1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17"/></svg>`;
icons.header['6'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 12h8m-8 6V6m8 12V6"/><circle cx="19" cy="16" r="2"/><path d="M20 10c-2 2-3 3.5-3 6"/></g></svg>`;
console.log(icons);

const title = {
  h1: '标题1',
  h2: '标题2',
  h3: '标题3',
  h4: '标题4',
  h5: '标题5',
  h6: '标题6',
  blockquote: '引用',
};
const descriptions = {
  blockquote: '插入引用格式',
};

export const defaultMenuItems: MenuItems[] = [
  ...new Array(6).fill(0).map((_, i) => ({
    name: `h${i + 1}`,
    alias: ['header', `head${i + 1}`],
    icon: icons.header[i + 1],
    title: title[`h${i + 1}` as 'h1'],
    handler(this: Quill) {
      const range = this.getSelection();
      if (!range) return;
      this.formatLine(range.index, range.index, 'header', i + 1, Quill.sources.USER);
    },
  })),
  {
    name: 'yy',
    alias: ['blockquote', 'bq'],
    icon: icons.blockquote,
    title: title.blockquote,
    descriptions: descriptions.blockquote,
    handler(this: Quill) {
      const range = this.getSelection();
      if (!range) return;
      this.formatLine(range.index, range.index, 'blockquote', true, Quill.sources.USER);
    },
  },
];
