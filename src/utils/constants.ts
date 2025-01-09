import type { Range } from 'quill';
import type TypeToolbar from 'quill/modules/toolbar';
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
  codeblock: '代码块',
  code: '行内代码',
  link: '链接',
  image: '图片',
  video: '视频',
  formula: '公式',
  listBullet: '无序列表',
  listOrdered: '有序列表',
  listCheck: '任务列表',
};
const descriptions = {
  blockquote: '插入引用格式',
};

const toolbarItemClick = (toolbarModule: TypeToolbar | null, format: string) => {
  if (!toolbarModule) return;
  const control = toolbarModule.controls.find(item => item[0] === format);
  if (!control) return;
  control[1].click();
};

export const defaultMenuItems: MenuItems[] = [
  ...new Array(6).fill(0).map((_, i) => ({
    name: `h${i + 1}`,
    alias: ['header', `head${i + 1}`],
    icon: icons.header[i + 1],
    title: title[`h${i + 1}` as 'h1'],
    handler(this: Quill, _: any, range: Range | null) {
      if (!range) return;
      this.formatLine(range.index, range.index, 'header', i + 1, Quill.sources.USER);
    },
  })),
  {
    name: 'bq',
    alias: ['blockquote'],
    icon: icons.blockquote,
    title: title.blockquote,
    descriptions: descriptions.blockquote,
    handler(this: Quill, _: any, range: Range | null) {
      if (!range) return;
      this.formatLine(range.index, range.index, 'blockquote', true, Quill.sources.USER);
    },
  },
  {
    name: 'cb',
    alias: ['code', 'codeblock'],
    icon: icons['code-block'],
    title: title.codeblock,
    handler(this: Quill, _: any, range: Range | null) {
      if (!range) return;
      this.formatLine(range.index, range.index, 'code-block', true, Quill.sources.USER);
    },
  },
  {
    name: 'ilc',
    alias: ['code', 'inlinecode'],
    icon: icons.code,
    title: title.code,
    handler(this: Quill, _: any, range: Range | null) {
      if (!range) return;
      this.format('code', true, Quill.sources.USER);
    },
  },
  {
    name: 'li',
    alias: ['link'],
    icon: icons.link,
    title: title.link,
    handler(this: Quill, _: any, range: Range | null) {
      if (!range) return;
      const toolbarModule = this.getModule('toolbar') as TypeToolbar;
      if (!toolbarModule) return;
      this.insertText(range.index, 'link', Quill.sources.USER);
      this.setSelection({ index: range.index, length: range.index + 4 });
      toolbarItemClick(toolbarModule, 'link');
    },
  },
  {
    name: 'img',
    alias: ['image', 'pic', 'picture'],
    icon: icons.image,
    title: title.image,
    handler(this: Quill, _: any, range: Range | null) {
      if (!range) return;
      toolbarItemClick(this.getModule('toolbar') as TypeToolbar, 'image');
    },
  },
  {
    name: 'vd',
    alias: ['video'],
    icon: icons.video,
    title: title.video,
    handler(this: Quill, _: any, range: Range | null) {
      if (!range) return;
      toolbarItemClick(this.getModule('toolbar') as TypeToolbar, 'video');
    },
  },
  {
    name: 'fm',
    alias: ['formula'],
    icon: icons.formula,
    title: title.formula,
    handler(this: Quill, _: any, range: Range | null) {
      if (!range) return;
      toolbarItemClick(this.getModule('toolbar') as TypeToolbar, 'formula');
    },
  },
  {
    name: 'bl',
    alias: ['list', 'bullet'],
    icon: icons.list.bullet,
    title: title.listBullet,
    handler(this: Quill, _: any, range: Range | null) {
      if (!range) return;
      this.formatLine(range.index, range.length, 'list', 'bullet', Quill.sources.USER);
    },
  },
  {
    name: 'od',
    alias: ['list', 'ordered'],
    icon: icons.list.ordered,
    title: title.listOrdered,
    handler(this: Quill, _: any, range: Range | null) {
      if (!range) return;
      this.formatLine(range.index, range.length, 'list', 'ordered', Quill.sources.USER);
    },
  },
  {
    name: 'ck',
    alias: ['list', 'check'],
    icon: icons.list.check,
    title: title.listCheck,
    handler(this: Quill, _: any, range: Range | null) {
      if (!range) return;
      this.formatLine(range.index, range.length, 'list', 'unchecked', Quill.sources.USER);
    },
  },
];
