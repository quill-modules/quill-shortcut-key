const Quill = window.Quill;
const {
  default: QuillShortcutKey,
  defaultMenuItems,
  defaultShortKey,
  // generateTableUpShortKeyMenu,
} = window.QuillShortcutKey;
// const { default: TableUp, defaultCustomSelect, createSelectBox, TableAlign, TableMenuContextmenu, TableResizeBox, TableResizeScale, TableSelection, TableVirtualScrollbar } = window.TableUp;

Quill.register({
  [`modules/shortcut-key`]: QuillShortcutKey,
  // [`modules/${TableUp.moduleName}`]: TableUp,
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
  [{ color: [] }, { background: [] }],
  [{ font: [] }, { align: [] }],
  // [{ [TableUp.toolName]: [] }],
];

// const { tableUpConfig, tableUpKeyboardControl } = generateTableUpShortKeyMenu(createSelectBox);
const quill1 = new Quill('#editor1', {
  // debug: 'info',
  theme: 'snow',
  modules: {
    'toolbar': toolbarConfig,
    'keyboard': {
      bindings: {
        ...defaultShortKey,
      },
    },
    'shortcut-key': {
      menuItems: [
        // tableUpConfig,
        ...defaultMenuItems,
      ],
      // menuKeyboardControls(event, data) {
      //   let result = false;
      //   result = tableUpKeyboardControl(event, data) || result;
      //   return result;
      // },
    },
  //   [TableUp.moduleName]: {
  //     scrollbar: TableVirtualScrollbar,
  //     align: TableAlign,
  //     resize: TableResizeBox,
  //     resizeScale: TableResizeScale,
  //     customSelect: defaultCustomSelect,
  //     selection: TableSelection,
  //     selectionOptions: {
  //       tableMenu: TableMenuContextmenu,
  //     },
  //   },
  },
});

const quill = [quill1];
window.quill = quill;

const output = [document.getElementById('output1')];

for (const [i, btn] of [document.getElementById('btn1')].entries()) {
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
