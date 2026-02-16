const Quill = window.Quill;
const {
  default: QuillShortcutKey,
  // eslint-disable-next-line unused-imports/no-unused-vars
  defaultMenuItems,
  defaultI18nMessages,
  defaultI18nMenuItems,
  defaultI18nPlaceholder,
  defaultShortKey,
  generateTableUpShortKeyMenu,
} = window.QuillShortcutKey;
const { default: TableUp, defaultCustomSelect, createSelectBox, TableAlign, TableMenuContextmenu, TableResizeBox, TableResizeScale, TableSelection, TableVirtualScrollbar } = window.TableUp;
const { default: QuillToolbarTip } = window.QuillToolbarTip;
const { EasyColorSnowTheme } = window.QuillEasyColor;
const { I18n } = window.QuillI18n;

Quill.register({
  [`themes/snow`]: EasyColorSnowTheme,
  [`modules/shortcut-key`]: QuillShortcutKey,
  [`modules/${TableUp.moduleName}`]: TableUp,
  [`modules/${QuillToolbarTip.moduleName}`]: QuillToolbarTip,
  'modules/i18n': I18n,
}, true);

const toolbarConfig = [
  ['clean'],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block', 'code'],
  ['link', 'image', 'video', 'formula'],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }, { header: 1 }, { header: 2 }, { header: 3 }, { header: 4 }, { header: 5 }, { header: 6 }],
  [{ font: [] }, { color: [] }, { background: [] }],
  [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
  [{ [TableUp.toolName]: [] }],
];

const messages = {
  'en-US': {
    toolbar: {
      'header': {
        '': 'Normal',
        '1': 'Heading 1',
        '2': 'Heading 2',
        '3': 'Heading 3',
        '4': 'Heading 4',
        '5': 'Heading 5',
        '6': 'Heading 6',
      },
      'size': {
        'small': 'Small',
        '': 'Normal',
        'large': 'Large',
        'huge': 'Huge',
      },
      'font': {
        '': 'Sans Serif',
        'sans': 'Sans Serif',
        'serif': 'Serif',
        'monospace': 'Monospace',
      },
      'script': {
        sub: 'Subscript',
        super: 'Superscript',
      },
      'align': {
        '': 'Align Left',
        'center': 'Align Center',
        'right': 'Align Right',
        'justify': 'Justify',
      },
      'indent': {
        '-1': 'Decrease Indent',
        '+1': 'Increase Indent',
      },
      'direction': {
        '': 'Switch to LTR',
        'rtl': 'Switch to RTL',
      },
      'list': {
        ordered: 'Numbered List',
        bullet: 'Bulleted List',
        check: 'Checklist',
      },
      'bold': 'Bold Text',
      'italic': 'Italic Text',
      'underline': 'Underline Text',
      'strike': 'Strikethrough',
      'blockquote': 'Block Quote',
      'code-block': 'Code Block',
      'code': 'Inline Code',
      'clean': 'Clear Formatting',
      'link': {
        '': 'Insert Link',
        'prompt': 'Enter link URL:',
      },
      'image': {
        '': 'Insert Image',
        'prompt': 'Enter image URL:',
      },
      'video': {
        '': 'Insert Video',
        'prompt': 'Enter video URL:',
      },
      'formula': 'Insert Formula',
      'color': 'Color',
      'background': 'Background Color',
    },
    ...defaultI18nMessages['en-US'],
  },
  'zh-CN': {
    toolbar: {
      'header': {
        '': '正文',
        '1': '标题 1',
        '2': '标题 2',
        '3': '标题 3',
        '4': '标题 4',
        '5': '标题 5',
        '6': '标题 6',
      },
      'size': {
        'small': '小',
        '': '正常',
        'large': '大',
        'huge': '超大',
      },
      'font': {
        '': '无衬线',
        'sans': '无衬线',
        'serif': '衬线',
        'monospace': '等宽',
      },
      'script': {
        sub: '下标',
        super: '上标',
      },
      'align': {
        '': '左对齐',
        'center': '居中对齐',
        'right': '右对齐',
        'justify': '两端对齐',
      },
      'indent': {
        '+1': '增加缩进',
        '-1': '减少缩进',
      },
      'direction': {
        '': '从左向右排列',
        'rtl': '从右向左排列',
      },
      'list': {
        ordered: '有序列表',
        bullet: '无序列表',
        check: '代办列表',
      },
      'bold': '加粗',
      'italic': '斜体',
      'underline': '下划线',
      'strike': '删除线',
      'blockquote': '引用',
      'code-block': '代码块',
      'code': '行内代码',
      'clean': '清除格式',
      'link': {
        '': '链接',
        'prompt': '请输入链接地址：',
      },
      'image': {
        '': '图片',
        'prompt': '请输入图片地址：',
      },
      'video': {
        '': '视频',
        'prompt': '请输入视频地址：',
      },
      'formula': '公式',
      'color': '文本颜色',
      'background': '背景颜色',
    },
    ...defaultI18nMessages['zh-CN'],
  },
};

const { tableUpConfig, tableUpKeyboardControl } = generateTableUpShortKeyMenu(createSelectBox, { useI18n: true });
const quill1 = new Quill('#editor1', {
  // debug: 'info',
  theme: 'snow',
  modules: {
    'toolbar': toolbarConfig,
    'keyboard': {
      bindings: {
        ...defaultShortKey,
        color: {
          key: 'c',
          altKey: true,
          shortKey: true,
          handler() {
            const selected = this.quill.getModule('toolbar').container.querySelector('.ql-color.ql-color-picker .ql-picker-options .ql-selected');
            this.quill.format('color', selected?.dataset?.value || false, Quill.sources.USER);
          },
        },
        background: {
          key: 'b',
          altKey: true,
          shortKey: true,
          handler() {
            const selected = this.quill.getModule('toolbar').container.querySelector('.ql-background.ql-color-picker .ql-picker-options .ql-selected');
            this.quill.format('background', selected?.dataset?.value || false, Quill.sources.USER);
          },
        },
      },
    },
    [QuillToolbarTip.moduleName]: {
      defaultTooltipOptions: {
        tipHoverable: false,
      },
      tipTextMap: {
        'background': 'Background\nalt+ctrl+c',
        'blockquote': 'Blockquote',
        'bold': 'Bold\nctrl+b',
        'clean': 'Clean\nctrl+/',
        'code': 'Code\nctrl+e',
        'color': 'Color\nalt+ctrl+b',
        'formula': 'Formula',
        'italic': 'Italic\nctrl+i',
        'image': 'Image',
        'strike': 'Strike\nctrl+d',
        'underline': 'Underline\nctrl+u',
        'video': 'Video',
        'link': 'Link',
        'list:ordered': 'Ordered List',
        'list:bullet': 'Unordered List',
        'list:check': 'Todo List',
        'align:left': 'Left aligned\nalt+l',
        'align:center': 'Center aligned\nalt+c',
        'align:right': 'Right aligned\nalt+r',
        'align:justify': 'Justify aligned\nalt+j',
        'script:super': 'Superscript\nctrl+,',
        'script:sub': 'Subscript\nctrl+.',
        'indent:-1': 'Minus Indent\nctrl+[',
        'indent:+1': 'Add Indent\nctrl+]',
        'text': 'Text',
        'header:1': 'Heading 1',
        'header:2': 'Heading 2',
        'header:3': 'Heading 3',
        'header:4': 'Heading 4',
        'header:5': 'Heading 5',
        'header:6': 'Heading 6',
        'direction': {
          onShow(target) {
            return target.classList.contains('ql-active') ? 'Text Direction Right To Left\nctrl+r' : 'Text Direction Left To Right\nctrl+l';
          },
        },
      },
    },
    [TableUp.moduleName]: {
      full: false,
      customSelect: defaultCustomSelect,
      modules: [
        { module: TableVirtualScrollbar },
        { module: TableAlign },
        { module: TableResizeBox },
        { module: TableResizeScale },
        { module: TableSelection },
        { module: TableMenuContextmenu },
      ],
    },
    // normal config
    // 'shortcut-key': {
    //   menuItems: [
    //     tableUpConfig,
    //     ...defaultMenuItems,
    //   ],
    //   menuKeyboardControls(event, data) {
    //     let result = false;
    //     result = tableUpKeyboardControl(event, data) || result;
    //     return result;
    //   },
    // },
    // i18n with shortcut key
    'i18n': {
      locale: 'en-US',
      messages,
    },
    'shortcut-key': {
      menuItems: [
        tableUpConfig,
        ...defaultI18nMenuItems,
      ],
      placeholder: defaultI18nPlaceholder,
      menuKeyboardControls(event, data) {
        let result = false;
        result = tableUpKeyboardControl(event, data) || result;
        return result;
      },
    },
  },
  themeOptions: {
    keepChooseColor: true,
  },
});

const quill = [quill1];
window.quill = quill;

for (let i = 0; i < 1; i++) {
  const btn = document.getElementById(`btn${i + 1}`);
  const output = document.getElementById(`output${i + 1}`);
  btn.addEventListener('click', () => {
    const content = quill[i].getContents();
    console.log(content);
    output[i].innerHTML = '';
    // eslint-disable-next-line unicorn/no-array-for-each
    content.forEach((content) => {
      const item = document.createElement('li');
      item.textContent = `${JSON.stringify(content)},`;
      output[i].appendChild(item);
    });
  });

  // Language selector
  const localeSelect = document.getElementById('locale-select1');
  localeSelect.addEventListener('change', (e) => {
    const i18n = quill[i].getModule('i18n');
    i18n.setLocale(e.target.value);
    console.log('Language changed to:', e.target.value);

    const shortcutKey = quill[i].getModule('shortcut-key');
    shortcutKey.refreshMenu();
  });
}
