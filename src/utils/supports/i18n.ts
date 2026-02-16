/* eslint-disable no-alert */
import type { Range } from 'quill';
import type { Menu, QuillShortcutKeyInstance } from '../types';
import Quill from 'quill';

const icons = Quill.import('ui/icons') as Record<string, any>;
icons.header['1'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5 6l3-2v8"/></svg>`;
icons.header['2'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m9 12h-4c0-4 4-3 4-6c0-1.5-2-2.5-4-1"/></svg>`;
icons.header['3'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5.5 4.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2m-2 3.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>`;
icons.header['4'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18V6m5 4v3a1 1 0 0 0 1 1h3m0-4v8M4 12h8m-8 6V6"/></svg>`;
icons.header['5'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5 7v-3h4m-4 7.7c.4.2.8.3 1.3.3c1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17"/></svg>`;
icons.header['6'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 12h8m-8 6V6m8 12V6"/><circle cx="19" cy="16" r="2"/><path d="M20 10c-2 2-3 3.5-3 6"/></g></svg>`;

export const I18N_KEYS = {
  PLACEHOLDER: 'shortcut-key.placeholder',
  H1_TITLE: 'shortcut-key.h1.title',
  H2_TITLE: 'shortcut-key.h2.title',
  H3_TITLE: 'shortcut-key.h3.title',
  H4_TITLE: 'shortcut-key.h4.title',
  H5_TITLE: 'shortcut-key.h5.title',
  H6_TITLE: 'shortcut-key.h6.title',
  BLOCKQUOTE_TITLE: 'shortcut-key.blockquote.title',
  BLOCKQUOTE_DESCRIPTIONS: 'shortcut-key.blockquote.descriptions',
  CODEBLOCK_TITLE: 'shortcut-key.codeblock.title',
  CODE_TITLE: 'shortcut-key.code.title',
  LINK_TITLE: 'shortcut-key.link.title',
  IMAGE_TITLE: 'shortcut-key.image.title',
  VIDEO_TITLE: 'shortcut-key.video.title',
  FORMULA_TITLE: 'shortcut-key.formula.title',
  LIST_TITLE: 'shortcut-key.list.title',
  LIST_BULLET_TITLE: 'shortcut-key.listBullet.title',
  LIST_ORDERED_TITLE: 'shortcut-key.listOrdered.title',
  LIST_CHECK_TITLE: 'shortcut-key.listCheck.title',
  TABLE_TITLE: 'shortcut-key.table.title',
} as const;

export const defaultI18nMessages = {
  'en-US': {
    'shortcut-key': {
      placeholder: 'Type / for commands',
      h1: { title: 'Heading 1' },
      h2: { title: 'Heading 2' },
      h3: { title: 'Heading 3' },
      h4: { title: 'Heading 4' },
      h5: { title: 'Heading 5' },
      h6: { title: 'Heading 6' },
      blockquote: { title: 'Blockquote', descriptions: 'Insert blockquote format' },
      codeblock: { title: 'Code Block' },
      code: { title: 'Inline Code' },
      link: { title: 'Link' },
      image: { title: 'Image' },
      video: { title: 'Video' },
      formula: { title: 'Formula' },
      list: { title: 'List' },
      listBullet: { title: 'Bullet List' },
      listOrdered: { title: 'Ordered List' },
      listCheck: { title: 'Checklist' },
      table: { title: 'Table' },
    },
  },
  'zh-CN': {
    'shortcut-key': {
      placeholder: '输入 / 调用菜单',
      h1: { title: '标题1' },
      h2: { title: '标题2' },
      h3: { title: '标题3' },
      h4: { title: '标题4' },
      h5: { title: '标题5' },
      h6: { title: '标题6' },
      blockquote: { title: '引用', descriptions: '插入引用格式' },
      codeblock: { title: '代码块' },
      code: { title: '行内代码' },
      link: { title: '链接' },
      image: { title: '图片' },
      video: { title: '视频' },
      formula: { title: '公式' },
      list: { title: '列表' },
      listBullet: { title: '无序列表' },
      listOrdered: { title: '有序列表' },
      listCheck: { title: '任务列表' },
      table: { title: '表格' },
    },
  },
} as const;

export function t(this: QuillShortcutKeyInstance, key: string): string {
  const i18nModule = this.quill.getModule('i18n') as any;
  if (i18nModule && typeof i18nModule.t === 'function') {
    return i18nModule.t(key);
  }
  // Fallback to default English text if i18n module not found
  const fallbacks: Record<string, string> = {
    [I18N_KEYS.PLACEHOLDER]: 'Type / for commands',
    [I18N_KEYS.H1_TITLE]: 'Heading 1',
    [I18N_KEYS.H2_TITLE]: 'Heading 2',
    [I18N_KEYS.H3_TITLE]: 'Heading 3',
    [I18N_KEYS.H4_TITLE]: 'Heading 4',
    [I18N_KEYS.H5_TITLE]: 'Heading 5',
    [I18N_KEYS.H6_TITLE]: 'Heading 6',
    [I18N_KEYS.BLOCKQUOTE_TITLE]: 'Blockquote',
    [I18N_KEYS.BLOCKQUOTE_DESCRIPTIONS]: 'Insert blockquote format',
    [I18N_KEYS.CODEBLOCK_TITLE]: 'Code Block',
    [I18N_KEYS.CODE_TITLE]: 'Inline Code',
    [I18N_KEYS.LINK_TITLE]: 'Link',
    [I18N_KEYS.IMAGE_TITLE]: 'Image',
    [I18N_KEYS.VIDEO_TITLE]: 'Video',
    [I18N_KEYS.FORMULA_TITLE]: 'Formula',
    [I18N_KEYS.LIST_TITLE]: 'List',
    [I18N_KEYS.LIST_BULLET_TITLE]: 'Bullet List',
    [I18N_KEYS.LIST_ORDERED_TITLE]: 'Ordered List',
    [I18N_KEYS.LIST_CHECK_TITLE]: 'Checklist',
    [I18N_KEYS.TABLE_TITLE]: 'Table',
  };
  return fallbacks[key] || key;
}

export function defaultI18nPlaceholder(this: QuillShortcutKeyInstance) {
  return t.call(this, I18N_KEYS.PLACEHOLDER);
}

export const defaultI18nMenuItems: Menu = [
  ...new Array(6).fill(0).map((_, i) => ({
    type: 'item' as const,
    name: `h${i + 1}`,
    alias: ['header', `head${i + 1}`],
    icon: icons.header[i + 1],
    title(this: QuillShortcutKeyInstance) {
      return t.call(this, `shortcut-key.h${i + 1}.title`);
    },
    onClick(this: Quill, range: Range | null, _: any) {
      if (!range) return;
      this.formatLine(range.index, 0, 'header', i + 1, Quill.sources.USER);
    },
  })),
  {
    type: 'item' as const,
    name: 'bq',
    alias: ['blockquote'],
    icon: icons.blockquote,
    title(this: QuillShortcutKeyInstance) {
      return t.call(this, I18N_KEYS.BLOCKQUOTE_TITLE);
    },
    descriptions(this: QuillShortcutKeyInstance) {
      return t.call(this, I18N_KEYS.BLOCKQUOTE_DESCRIPTIONS);
    },
    onClick(this: Quill, range: Range | null, _: any) {
      if (!range) return;
      this.formatLine(range.index, 0, 'blockquote', true, Quill.sources.USER);
    },
  },
  {
    type: 'item' as const,
    name: 'cb',
    alias: ['code', 'codeblock'],
    icon: icons['code-block'],
    title(this: QuillShortcutKeyInstance) {
      return t.call(this, I18N_KEYS.CODEBLOCK_TITLE);
    },
    onClick(this: Quill, range: Range | null, _: any) {
      if (!range) return;
      this.formatLine(range.index, 0, 'code-block', true, Quill.sources.USER);
    },
  },
  {
    type: 'item' as const,
    name: 'lk',
    alias: ['link'],
    icon: icons.link,
    title(this: QuillShortcutKeyInstance) {
      return t.call(this, I18N_KEYS.LINK_TITLE);
    },
    onClick(this: Quill, range: Range | null, _: any) {
      if (!range) return;
      const title = prompt('Enter link title');
      if (!title) return;
      const link = prompt('Enter link URL');
      if (!link) return;
      this.insertText(range.index, title, Quill.sources.USER);
      this.formatText(range.index, range.length + title.length, 'link', link, Quill.sources.USER);
      this.setSelection({ index: range.index, length: range.index + title.length });
    },
  },
  {
    type: 'item' as const,
    name: 'img',
    alias: ['image', 'pic', 'picture'],
    icon: icons.image,
    title(this: QuillShortcutKeyInstance) {
      return t.call(this, I18N_KEYS.IMAGE_TITLE);
    },
    onClick(this: Quill, range: Range | null, _: any) {
      if (!range) return;
      const src = prompt('Enter image');
      if (!src) return;
      this.insertEmbed(range.index, 'image', src, Quill.sources.USER);
    },
  },
  {
    type: 'item' as const,
    name: 'vd',
    alias: ['video'],
    icon: icons.video,
    title(this: QuillShortcutKeyInstance) {
      return t.call(this, I18N_KEYS.VIDEO_TITLE);
    },
    onClick(this: Quill, range: Range | null, _: any) {
      if (!range) return;
      const src = prompt('Enter video');
      if (!src) return;
      this.insertEmbed(range.index, 'video', src, Quill.sources.USER);
    },
  },
  {
    type: 'item' as const,
    name: 'fm',
    alias: ['formula'],
    icon: icons.formula,
    title(this: QuillShortcutKeyInstance) {
      return t.call(this, I18N_KEYS.FORMULA_TITLE);
    },
    onClick(this: Quill, range: Range | null, _: any) {
      if (!range) return;
      const text = prompt('Enter formula');
      if (!text) return;
      this.insertEmbed(range.index, 'formula', text, Quill.sources.USER);
    },
  },
  {
    type: 'group' as const,
    name: 'list',
    alias: [],
    hideSearch: true,
    icon: icons.list.bullet,
    title(this: QuillShortcutKeyInstance) {
      return t.call(this, I18N_KEYS.LIST_TITLE);
    },
    children: [
      {
        type: 'item' as const,
        name: 'bl',
        alias: ['list', 'bullet'],
        icon: icons.list.bullet,
        title(this: QuillShortcutKeyInstance) {
          return t.call(this, I18N_KEYS.LIST_BULLET_TITLE);
        },
        onClick(this: Quill, range: Range | null, _: any) {
          if (!range) return;
          this.formatLine(range.index, 0, 'list', 'bullet', Quill.sources.USER);
        },
      },
      {
        type: 'item' as const,
        name: 'od',
        alias: ['list', 'ordered'],
        icon: icons.list.ordered,
        title(this: QuillShortcutKeyInstance) {
          return t.call(this, I18N_KEYS.LIST_ORDERED_TITLE);
        },
        onClick(this: Quill, range: Range | null, _: any) {
          if (!range) return;
          this.formatLine(range.index, 0, 'list', 'ordered', Quill.sources.USER);
        },
      },
      {
        type: 'item' as const,
        name: 'ck',
        alias: ['list', 'check'],
        icon: icons.list.check,
        title(this: QuillShortcutKeyInstance) {
          return t.call(this, I18N_KEYS.LIST_CHECK_TITLE);
        },
        onClick(this: Quill, range: Range | null, _: any) {
          if (!range) return;
          this.formatLine(range.index, 0, 'list', 'unchecked', Quill.sources.USER);
        },
      },
    ],
  },
];
