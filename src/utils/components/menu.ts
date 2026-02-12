import type { MenuItemData } from '../types';
import { createBEM } from '../bem';

const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>`;
const bem = createBEM('qsf', 'menu');
export function createMenu(data: MenuItemData[]) {
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
        itemWrapper.addEventListener('mouseenter', showSubMenu);
        itemWrapper.addEventListener('mouseleave', closeSubMenu);
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
}
