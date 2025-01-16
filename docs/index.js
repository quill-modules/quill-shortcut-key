const Quill = window.Quill;
const {
  default: QuillShortcutKey,
  defaultMenuItems,
  defaultShortKey,
  generateTableUpShortKeyMenu,
} = window.QuillShortcutKey;
const { default: TableUp, defaultCustomSelect, createSelectBox, TableAlign, TableMenuContextmenu, TableResizeBox, TableResizeScale, TableSelection, TableVirtualScrollbar } = window.TableUp;
const { default: QuillToolbarTip } = window.QuillToolbarTip;
const { EasyColorSnowTheme } = window.QuillEasyColor;

Quill.register({
  [`themes/snow`]: EasyColorSnowTheme,
  [`modules/shortcut-key`]: QuillShortcutKey,
  [`modules/${TableUp.moduleName}`]: TableUp,
  [`modules/${QuillToolbarTip.moduleName}`]: QuillToolbarTip,
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

const { tableUpConfig, tableUpKeyboardControl } = generateTableUpShortKeyMenu(createSelectBox);
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
    'shortcut-key': {
      menuItems: [
        tableUpConfig,
        ...defaultMenuItems,
      ],
      menuKeyboardControls(event, data) {
        let result = false;
        result = tableUpKeyboardControl(event, data) || result;
        return result;
      },
    },
    [TableUp.moduleName]: {
      scrollbar: TableVirtualScrollbar,
      align: TableAlign,
      resize: TableResizeBox,
      resizeScale: TableResizeScale,
      customSelect: defaultCustomSelect,
      selection: TableSelection,
      selectionOptions: {
        tableMenu: TableMenuContextmenu,
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
}
