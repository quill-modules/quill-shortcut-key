import { createBEM } from '../bem';

const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>`;

export type MenuItemData = {
  type: 'item';
  icon?: string;
  text?: string;
  content?: () => HTMLElement;
  children?: MenuItemData[];
  classes?: string[];
  onHover?: (item: MenuItemData, index: number) => void;
  onClick?: (item: MenuItemData, index: number) => void;
} | {
  type: 'break';
  classes?: string[];
};

const bem = createBEM('qsf', 'menu');
export const createMenu = (data: MenuItemData[]) => {
  const wrapper = document.createElement('div');
  wrapper.classList.add(bem.b());

  for (const [index, item] of data.entries()) {
    const { type, classes = [] } = item;
    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add(bem.be('item'), ...classes);
    itemWrapper.dataset.index = index.toString();

    if (type === 'break') {
      itemWrapper.classList.add(bem.is('break'));
    }
    else if (type === 'item') {
      const { icon, text, content, children = [], onHover, onClick } = item;
      if (!icon && !text && !content) continue;
      if (content) {
        itemWrapper.appendChild(content());
      }
      else {
        if (icon) {
          const iconEl = document.createElement('span');
          iconEl.classList.add(bem.be('icon'));
          iconEl.innerHTML = icon;
          itemWrapper.appendChild(iconEl);
        }
        if (text) {
          const textEl = document.createElement('span');
          textEl.textContent = text;
          itemWrapper.appendChild(textEl);
        }
      }
      if (children.length > 0) {
        itemWrapper.dataset.hasChildren = 'true';
        const arrowEl = document.createElement('span');
        arrowEl.classList.add(bem.be('icon'), bem.is('arrow'));
        arrowEl.innerHTML = arrow;
        itemWrapper.appendChild(arrowEl);

        const subMenu = createMenu(children);
        subMenu.classList.add(bem.is('transparent'));
        let timer: ReturnType<typeof setTimeout> | undefined;
        const removeSubMenu = () => {
          subMenu.remove();
        };
        const showSubMenu = () => {
          if (itemWrapper.contains(subMenu)) return;
          if (timer) {
            clearTimeout(timer);
            timer = undefined;
          }
          itemWrapper.classList.add(bem.is('active'));
          subMenu.dataset.parent = index.toString();
          subMenu.removeEventListener('transitionend', removeSubMenu);
          const rect = itemWrapper.getBoundingClientRect();
          Object.assign(subMenu.style, {
            position: 'fixed',
            width: `${rect.width}px`,
            top: `${rect.top}px`,
            left: `${rect.right}px`,
          });
          itemWrapper.appendChild(subMenu);
          requestAnimationFrame(() => {
            subMenu.classList.remove(bem.is('transparent'));
            const subRect = subMenu.getBoundingClientRect();
            if (subRect.right > window.innerWidth) {
              Object.assign(subMenu.style, {
                left: `${rect.left - subRect.width}px`,
              });
            }
            if (subRect.bottom > window.innerHeight) {
              Object.assign(subMenu.style, {
                top: `${rect.bottom - subRect.height}px`,
              });
            }
          });
        };
        const closeSubMenu = () => {
          if (timer) {
            clearTimeout(timer);
            timer = undefined;
          }
          itemWrapper.classList.add(bem.is('active'));
          timer = setTimeout(() => {
            subMenu.addEventListener('transitionend', removeSubMenu, { once: true });
            subMenu.classList.add(bem.is('transparent'));
          }, 150);
        };

        itemWrapper.addEventListener('click', showSubMenu);
        for (const el of [itemWrapper, subMenu]) {
          el.addEventListener('mouseenter', showSubMenu);
          el.addEventListener('mouseleave', closeSubMenu);
        }
      }

      if (onHover) {
        itemWrapper.addEventListener('mouseenter', () => onHover(item, index));
      }
      if (onClick) {
        itemWrapper.addEventListener('click', () => onClick(item, index));
      }
    }
    else {
      continue;
    }

    wrapper.appendChild(itemWrapper);
  }
  return wrapper;
};

export const setupMenuKeyboardControls = (menuWrapper: HTMLElement, bindTarget: HTMLElement) => {
  let currentMenu = menuWrapper; // 当前显示的菜单
  let parentMenu: HTMLElement | null = null; // 上一级菜单
  let selectedIndex = -1; // 当前选中的菜单项索引

  const setSelected = (index: number) => {
    const items = Array.from(currentMenu.querySelectorAll(`.${bem.be('item')}`)) as HTMLElement[];
    for (const [i, item] of items.entries()) {
      if (i === index) {
        item.classList.add(bem.is('selected'));

        const containerRect = currentMenu.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        const isItemBelow = itemRect.bottom > containerRect.bottom;
        const isItemAbove = itemRect.top < containerRect.top;
        if (isItemBelow) {
          // 底部对齐
          currentMenu.scrollTop = item.offsetTop - currentMenu.clientHeight + itemRect.height;
        }
        else if (isItemAbove) {
          // 顶部对齐
          currentMenu.scrollTop = item.offsetTop;
        }
      }
      else {
        item.classList.remove(bem.is('selected'));
      }
    }
    selectedIndex = index;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const items = currentMenu.querySelectorAll(`.${bem.be('item')}`);
    if (items.length === 0) return;

    switch (event.key) {
      case 'ArrowUp': {
        event.preventDefault();
        setSelected((selectedIndex - 1 + items.length) % items.length);
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        setSelected((selectedIndex + 1) % items.length);
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        const selectedItem = items[selectedIndex] as HTMLElement;
        const hasSubMenu = selectedItem.dataset.hasChildren === 'true';
        if (hasSubMenu) {
          selectedItem.click();
          const subMenu = selectedItem.querySelector(`.${bem.b()}`) as HTMLElement;
          if (subMenu) {
            parentMenu = currentMenu;
            currentMenu = subMenu;
            setSelected(0);
          }
        }
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        if (parentMenu) {
          const parentIndex = Number.parseInt(currentMenu.dataset.parent || '0', 10);
          currentMenu.remove();
          currentMenu = parentMenu;
          parentMenu = null;
          selectedIndex = parentIndex;
          setSelected(selectedIndex);
        }
        break;
      }
      case 'Enter': {
        event.preventDefault();
        const selectedItem = items[selectedIndex] as HTMLElement;
        selectedItem.click();
        break;
      }
    }
  };

  bindTarget.addEventListener('keydown', handleKeyDown, true);
  return () => {
    bindTarget.removeEventListener('keydown', handleKeyDown, true);
  };
};
