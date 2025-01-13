/* eslint-disable no-alert */
import type { Range } from 'quill';
import type { Context } from 'quill/modules/keyboard';
import type { Menu, MenuEventData } from './types';
import Quill from 'quill';
import { isUndefined } from './is';

const icons = Quill.import('ui/icons') as Record<string, any>;
icons.header['1'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5 6l3-2v8"/></svg>`;
icons.header['2'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m9 12h-4c0-4 4-3 4-6c0-1.5-2-2.5-4-1"/></svg>`;
icons.header['3'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5.5 4.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2m-2 3.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>`;
icons.header['4'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18V6m5 4v3a1 1 0 0 0 1 1h3m0-4v8M4 12h8m-8 6V6"/></svg>`;
icons.header['5'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h8m-8 6V6m8 12V6m5 7v-3h4m-4 7.7c.4.2.8.3 1.3.3c1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17"/></svg>`;
icons.header['6'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="ql-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 12h8m-8 6V6m8 12V6"/><circle cx="19" cy="16" r="2"/><path d="M20 10c-2 2-3 3.5-3 6"/></g></svg>`;

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
  list: '列表',
  listBullet: '无序列表',
  listOrdered: '有序列表',
  listCheck: '任务列表',
};
const descriptions = {
  blockquote: '插入引用格式',
};

export const defaultMenuItems: Menu = [
  ...new Array(6).fill(0).map((_, i) => ({
    type: 'item' as const,
    name: `h${i + 1}`,
    alias: ['header', `head${i + 1}`],
    icon: icons.header[i + 1],
    title: title[`h${i + 1}` as 'h1'],
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
    title: title.blockquote,
    descriptions: descriptions.blockquote,
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
    title: title.codeblock,
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
    title: title.link,
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
    title: title.image,
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
    title: title.video,
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
    title: title.formula,
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
    title: title.list,
    children: [
      {
        type: 'item' as const,
        name: 'bl',
        alias: ['list', 'bullet'],
        icon: icons.list.bullet,
        title: title.listBullet,
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
        title: title.listOrdered,
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
        title: title.listCheck,
        onClick(this: Quill, range: Range | null, _: any) {
          if (!range) return;
          this.formatLine(range.index, 0, 'list', 'unchecked', Quill.sources.USER);
        },
      },
    ],
  },
];

const generateShortKey = (formatWithKeyMap: Record<string, Record<string, any>>) => {
  const formatAndValue = Object.keys(formatWithKeyMap);
  const bindings: Record<string, any> = {};
  for (const item of formatAndValue) {
    const [format, value] = item.split(' ');
    const isSwitch = isUndefined(value);
    bindings[item] = {
      handler(this: { quill: Quill }, range: Range, context: Context) {
        this.quill.format(format, isSwitch ? !context.format[format] : value, Quill.sources.USER);
      },
      ...formatWithKeyMap[item],
    };
  }
  return bindings;
};
export const defaultShortKey = {
  clean: {
    key: '/',
    shortKey: true,
    handler(this: { quill: Quill }, range: Range) {
      this.quill.removeFormat(range.index, range.length, Quill.sources.USER);
    },
  },
  ...generateShortKey({
    'strike': {
      key: 'd',
      shortKey: true,
    },
    'align ': {
      key: 'l',
      altKey: true,
    },
    'align center': {
      key: 'c',
      altKey: true,
    },
    'align right': {
      key: 'r',
      altKey: true,
    },
    'align justify': {
      key: 'j',
      altKey: true,
    },
    'indent +1': {
      key: ']',
      shortKey: true,
    },
    'indent -1': {
      key: '[',
      shortKey: true,
    },
    'script sub': {
      key: ';',
      shortKey: true,
    },
    'script super': {
      key: '\'',
      shortKey: true,
    },
    'code': {
      key: 'e',
      shortKey: true,
    },
    'direction rtl': {
      key: 'r',
      shortKey: true,
    },
    'direction ': {
      key: 'l',
      shortKey: true,
    },
  }),
};

export function generateTableUpShortKeyMenu(createSelectBox: (ops: { row: number; col: number; customBtn: boolean }) => HTMLElement) {
  const maxSelectRow = 8;
  const maxSelectCol = 8;
  const selectBox = createSelectBox({
    row: maxSelectRow,
    col: maxSelectCol,
    customBtn: false,
  });
  const updateSelectActiveItems = () => {
    const { row, col } = selectBox.dataset;
    for (const item of Array.from(selectBox.querySelectorAll('.active'))) {
      item.classList.remove('active');
    }
    if (!row || !col) return;
    const childs = Array.from(selectBox.querySelectorAll('.table-up-select-box__item')) as HTMLElement[];
    for (let i = 0; i < childs.length; i++) {
      const { row: childRow, col: childCol } = childs[i].dataset;
      if (childRow! > row && childCol! > col) {
        return;
      }
      if (childRow! <= row && childCol! <= col) {
        childs[i].classList.add('active');
      }
      else {
        childs[i].classList.remove('active');
      }
    }
  };

  return {
    tableUpKeyboardControl: (event: KeyboardEvent, { currentMenu }: { currentMenu: HTMLElement; selectedIndex: number }) => {
      if (!currentMenu.contains(selectBox)) return false;
      let row = Number(selectBox.dataset.row);
      let col = Number(selectBox.dataset.col);
      switch (event.key) {
        case 'ArrowUp': {
          row -= 1;
          break;
        }
        case 'ArrowDown': {
          row += 1;
          break;
        }
        case 'ArrowRight': {
          col += 1;
          break;
        }
        case 'ArrowLeft': {
          col -= 1;
          break;
        }
        default: {
          return false;
        }
      }
      if (row <= 0 || col <= 0) return false;
      row = Math.min(row, 8);
      col = Math.min(col, 8);
      selectBox.dataset.row = String(row);
      selectBox.dataset.col = String(col);
      updateSelectActiveItems();
      event.preventDefault();
      return true;
    },
    tableUpConfig: {
      type: 'group',
      name: 'table',
      alias: [],
      title: '表格',
      icon: (Quill.import('ui/icons') as Record<string, string>).table,
      onOpenSub(data: MenuEventData) {
        const subMenu = data.item.querySelector('.qsf-menu') as HTMLElement;
        if (subMenu) {
          subMenu.style.width = 'auto';
        }
        selectBox.dataset.row = '1';
        selectBox.dataset.col = '1';
        updateSelectActiveItems();
      },
      children: [
        {
          type: 'item',
          name: 'table',
          alias: [],
          hideSearch: true,
          content() {
            return selectBox;
          },
          onClick(this: Quill) {
            const { row, col } = selectBox.dataset;
            if (!row || !col) return;
            const tableUp = this.getModule('table-up') as any;
            tableUp.insertTable(Number(row), Number(col));
          },
        },
      ],
    },
  };
}
