const Quill = window.Quill;
const {
  default: QuillShortcutKey,
  defaultI18nMessages,
  defaultI18nMenuItems,
  defaultI18nPlaceholder,
  defaultShortKey,
  generateTableUpShortKeyMenu,
} = window.QuillShortcutKey;
const {
  default: TableUp,
  defaultCustomSelect,
  createSelectBox,
  TableAlign,
  TableMenuContextmenu,
  TableResizeBox,
  TableResizeScale,
  TableSelection,
  TableVirtualScrollbar,
} = window.TableUp;
const { default: QuillToolbarTip, createI18nToolbarTipMap } = window.QuillToolbarTip;
const { EasyColorSnowTheme } = window.QuillEasyColor;
const { I18n } = window.QuillI18n;

Quill.register({
  'themes/snow': EasyColorSnowTheme,
  'modules/shortcut-key': QuillShortcutKey,
  [`modules/${TableUp.moduleName}`]: TableUp,
  [`modules/${QuillToolbarTip.moduleName}`]: QuillToolbarTip,
  'modules/i18n': I18n,
}, true);

function createI18nToolbarTipWithShortCut() {
  const tipTextMap = createI18nToolbarTipMap();

  const simpleShortcuts = {
    bold: 'ctrl+b',
    italic: 'ctrl+i',
    underline: 'ctrl+u',
    strike: 'ctrl+d',
    clean: 'ctrl+/',
    code: 'ctrl+e',
    color: 'alt+ctrl+b',
    background: 'alt+ctrl+c',
  };
  for (const [format, shortcut] of Object.entries(simpleShortcuts)) {
    const original = tipTextMap[format];
    tipTextMap[format] = {
      onShow(...args) {
        const text = original.onShow.call(this, ...args);
        return text ? `${text}\n${shortcut}` : shortcut;
      },
    };
  }

  const valueShortcuts = {
    'align.': 'alt+l',
    'align.center': 'alt+c',
    'align.right': 'alt+r',
    'align.justify': 'alt+j',
    'script.super': 'ctrl+,',
    'script.sub': 'ctrl+.',
    'indent.-1': 'ctrl+[',
    'indent.+1': 'ctrl+]',
  };
  for (const format of ['align', 'script', 'indent']) {
    const original = tipTextMap[format];
    tipTextMap[format] = {
      onShow(target, value) {
        const text = original.onShow.call(this, target, value);
        const shortcut = valueShortcuts[`${format}.${value}`];
        return shortcut ? `${text}\n${shortcut}` : text;
      },
    };
  }

  tipTextMap.direction = {
    onShow(target) {
      const i18n = this.getModule('i18n');
      const isRTL = target.classList.contains('ql-active');
      const text = i18n.t(`toolbar.direction.${isRTL ? 'rtl' : ''}`);
      return `${text}\n${isRTL ? 'ctrl+r' : 'ctrl+l'}`;
    },
  };

  return tipTextMap;
}

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

const tableUpMessages = {
  'en-US': {
    tableUp: {
      fullCheckboxText: 'Insert full width table',
      customBtnText: 'Custom',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      rowText: 'Row',
      colText: 'Column',
      notPositiveNumberError: 'Please enter a positive integer',
      custom: 'Custom',
      clear: 'Clear',
      transparent: 'Transparent',
      perWidthInsufficient: 'The percentage width is insufficient. To complete the operation, the table needs to be converted to a fixed width. Do you want to continue?',
      CopyCell: 'Copy cell',
      CutCell: 'Cut cell',
      InsertTop: 'Insert row above',
      InsertRight: 'Insert column right',
      InsertBottom: 'Insert row below',
      InsertLeft: 'Insert column left',
      MergeCell: 'Merge Cell',
      SplitCell: 'Split Cell',
      DeleteRow: 'Delete Row',
      DeleteColumn: 'Delete Column',
      DeleteTable: 'Delete table',
      BackgroundColor: 'Set background color',
      BorderColor: 'Set border color',
      SwitchWidth: 'Switch table width',
      InsertCaption: 'Insert table caption',
      ToggleTdBetweenTh: 'Toggle td between th',
      ConvertTothead: 'Convert to thead',
      ConvertTotfoot: 'Convert to tfoot',
    },
  },
  'zh-CN': {
    tableUp: {
      fullCheckboxText: '插入满宽表格',
      customBtnText: '自定义行列数',
      confirmText: '确认',
      cancelText: '取消',
      rowText: '行数',
      colText: '列数',
      notPositiveNumberError: '请输入正整数',
      custom: '自定义',
      clear: '清除',
      transparent: '透明',
      perWidthInsufficient: '百分比宽度不足。若继续操作，需要转为固定宽度，是否继续？',
      CopyCell: '复制单元格',
      CutCell: '剪切单元格',
      InsertTop: '向上插入一行',
      InsertRight: '向右插入一列',
      InsertBottom: '向下插入一行',
      InsertLeft: '向左插入一列',
      MergeCell: '合并单元格',
      SplitCell: '拆分单元格',
      DeleteRow: '删除当前行',
      DeleteColumn: '删除当前列',
      DeleteTable: '删除当前表格',
      BackgroundColor: '设置背景颜色',
      BorderColor: '设置边框颜色',
      SwitchWidth: '切换表格宽度',
      InsertCaption: '插入表格标题',
      ToggleTdBetweenTh: '切换表头单元格',
      ConvertTothead: '转换为表头',
      ConvertTotfoot: '转换为表尾',
    },
  },
};

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
    ...tableUpMessages['en-US'],
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
    ...tableUpMessages['zh-CN'],
  },
};

const { tableUpConfig, tableUpKeyboardControl } = generateTableUpShortKeyMenu(createSelectBox, { useI18n: true });
const quill1 = new Quill('#editor1', {
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
      tipTextMap: createI18nToolbarTipWithShortCut(),
    },
    'i18n': {
      locale: 'en-US',
      messages,
    },
    [TableUp.moduleName]: {
      full: false,
      customSelect: defaultCustomSelect,
      customBtn: true,
      fullSwitch: true,
      texts(key) {
        const i18n = this.quill.getModule('i18n');
        return i18n.t(`tableUp.${key}`, {}, key);
      },
      modules: [
        { module: TableVirtualScrollbar },
        { module: TableAlign },
        { module: TableResizeBox },
        { module: TableResizeScale },
        { module: TableSelection },
        { module: TableMenuContextmenu },
      ],
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

const quills = [quill1];
window.quill = quills;

for (let i = 0; i < quills.length; i++) {
  const btn = document.getElementById(`btn${i + 1}`);
  const output = document.getElementById(`output${i + 1}`);

  btn.addEventListener('click', () => {
    const content = quills[i].getContents();
    console.log(content);
    output.innerHTML = '';
    for (const itemContent of content) {
      const item = document.createElement('li');
      item.textContent = `${JSON.stringify(itemContent)},`;
      output.appendChild(item);
    }
  });

  const localeSelect = document.getElementById('locale-select1');
  localeSelect.addEventListener('change', async (e) => {
    const i18n = quills[i].getModule('i18n');
    i18n.setLocale(e.target.value);

    const shortcutKey = quills[i].getModule('shortcut-key');
    shortcutKey.refreshMenu();

    const tableUp = quills[i].getModule(TableUp.moduleName);
    await tableUp?.refreshUI();

    console.log('Language changed to:', e.target.value);
  });
}
