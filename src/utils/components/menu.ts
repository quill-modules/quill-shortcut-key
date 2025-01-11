import type { MenuItemData } from '../types';
import { createBEM } from '../bem';
import { throttle } from '../function';

const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>`;
const bem = createBEM('qsf', 'menu');
export const createMenu = (data: MenuItemData[]) => {
  const wrapper = document.createElement('div');
  wrapper.classList.add(bem.b());

  for (const [index, item] of data.entries()) {
    const { type, classes = [] } = item;
    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add(bem.be('item'), ...classes);

    if (type === 'break') {
      itemWrapper.classList.add(bem.is('break'));
    }
    else if (type === 'item') {
      const { icon, text, content, children = [], onHover, onClick, onClose, onOpen } = item;
      if (!icon && !text && !content) continue;
      const eventArg = {
        data: item,
        index,
        item: itemWrapper,
      };
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
          onClose?.(eventArg);
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
            onOpen?.(eventArg);
          });
        };
        const closeSubMenu = () => {
          if (timer) {
            clearTimeout(timer);
            timer = undefined;
          }
          timer = setTimeout(() => {
            subMenu.addEventListener('transitionend', removeSubMenu, { once: true });
            subMenu.classList.add(bem.is('transparent'));
          }, 150);
        };

        itemWrapper.addEventListener('click', showSubMenu);
        for (const el of [itemWrapper]) {
          el.addEventListener('mouseenter', showSubMenu);
          el.addEventListener('mouseleave', closeSubMenu);
        }
      }

      if (onHover) {
        itemWrapper.addEventListener('mouseenter', () => onHover(eventArg));
      }
      if (onClick) {
        itemWrapper.addEventListener('click', () => onClick(eventArg));
      }
    }
    else {
      continue;
    }

    wrapper.appendChild(itemWrapper);
  }
  return wrapper;
};

export const setupMenuKeyboardControls = ({ wrapper, target, menuControl }: {
  wrapper: HTMLElement;
  target: HTMLElement;
  menuControl: (event: KeyboardEvent, data: { currentMenu: HTMLElement; selectedIndex: number }) => boolean;
}) => {
  let currentMenu = wrapper; // 当前显示的菜单
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
          currentMenu.scrollTop = item.offsetTop - currentMenu.clientHeight + itemRect.height;
        }
        else if (isItemAbove) {
          currentMenu.scrollTop = item.offsetTop;
        }
      }
      else {
        item.classList.remove(bem.is('selected'));
      }
    }
    selectedIndex = index;
  };

  const handleKeyDown = throttle((event: KeyboardEvent) => {
    const items = currentMenu.querySelectorAll(`.${bem.be('item')}`);
    if (items.length === 0) return;

    const prevent = menuControl(event, { currentMenu, selectedIndex });
    if (prevent) return;

    switch (event.key) {
      case 'ArrowUp': {
        event.preventDefault();
        if (selectedIndex === -1) selectedIndex = 0;
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
        if (!selectedItem) return;
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
          currentMenu = parentMenu;
          parentMenu = null;
          selectedIndex = parentIndex;
          setSelected(selectedIndex);
          const selectedItem = Array.from(currentMenu.querySelectorAll(`.${bem.be('item')}`))[selectedIndex] as HTMLElement;
          if (!selectedItem) return;
          selectedItem.dispatchEvent(new MouseEvent('mouseleave'));
        }
        break;
      }
      case 'Enter': {
        event.preventDefault();
        const selectedItem = items[selectedIndex] as HTMLElement;
        if (selectedItem) {
          selectedItem.click();
        }
        break;
      }
    }
  }, 100);

  target.addEventListener('keydown', handleKeyDown, true);
  return () => {
    target.removeEventListener('keydown', handleKeyDown, true);
  };
};
