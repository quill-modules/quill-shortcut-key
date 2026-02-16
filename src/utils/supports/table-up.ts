import type { MenuEventData, MenuItemsGroup, QuillShortcutKeyInstance, QuillShortcutKeyOptions } from '../types';
import Quill from 'quill';
import { I18N_KEYS, t } from './i18n';

export function generateTableUpShortKeyMenu(
  createSelectBox: (ops: { row: number; col: number; customBtn: boolean }) => HTMLElement,
  options: { useI18n?: boolean } = {},
): {
  tableUpKeyboardControl: QuillShortcutKeyOptions['menuKeyboardControls'];
  tableUpConfig: MenuItemsGroup;
} {
  const { useI18n = false } = options;

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
    for (const item of childs) {
      const { row: childRow, col: childCol } = item.dataset;
      if (childRow! > row && childCol! > col) {
        return;
      }
      item.classList.toggle('active', childRow! <= row && childCol! <= col);
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
      title(this: QuillShortcutKeyInstance) {
        return useI18n ? t.call(this, I18N_KEYS.TABLE_TITLE) : 'Table';
      },
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
          classes: ['no-selected-style'],
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
