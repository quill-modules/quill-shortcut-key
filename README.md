# quill-shortcut-key

A Quill plugin to format text or insert blot as short.

[demo](https://zzxming.github.io/quill-shortcut-key/)

## Usage

```sh
npm install quill-shortcut-key
```

```js
import Quill from 'quill';
import QuillShortcutKey, { defaultMenuItems, defaultShortKey } from 'quill-shortcut-key';
import 'quill/dist/quill.snow.css';
import 'quill-shortcut-key/index.css';

Quill.register({ [`modules/shortcut-key`]: QuillShortcutKey }, true);

const quill = new Quill('#editor', {
  // ...
  modules: {
    //  ...
    'keyboard': {
      bindings: {
        ...defaultShortKey,
      },
    },
    'shortcut-key': {
      menuItems: defaultMenuItems,
    },
  },
});
```

## Options

| attribute            | description                                                                              | type                                                                                           | default                 |
| -------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------- |
| menuItems            | shortcut key menu items                                                                  | `(MenuItems \| MenuItemsGroup)[]`                                                              | -                       |
| placeholder          | line placeholder text                                                                    | `string`                                                                                       | `'Input / recall menu'` |
| menuKeyboardControls | trigger when use keyboard select menu item. if return true will prevent move active item | `(event: KeyboardEvent, data: { currentMenu: HTMLElement; selectedIndex: number }) => boolean` | `() => false`           |

> I recommend using it with [quill-toolbar-tip](https://github.com/opentiny/quill-toolbar-tip) to prompt about the usage of shortcut keys.

<details>
  <summary> types </summary>

```ts
interface MenuCommonOptions {
  hideSearch?: boolean;
  icon?: string;
  title?: string;
  content?: () => HTMLElement;
  descriptions?: string;
  onClick?: (this: Quill, range: Range | null, data: MenuEventData) => void;
  onCloseSub?: (this: Quill, data: MenuEventData) => void;
  onOpenSub?: (this: Quill, data: MenuEventData) => void;
}
interface MenuItems extends MenuCommonOptions {
  type: 'item';
  name: string;
  alias: string[];
}
interface MenuItemsGroup extends MenuCommonOptions {
  type: 'group';
  children: MenuItems[];
}
```

</details>

## Other Module

### Table

use the module `quill-table-up`. you need install it first

```ts
import QuillShortcutKey, { defaultMenuItems, generateTableUpShortKeyMenu } from 'quill-shortcut-key';
import { createSelectBox } from 'quill-table-up';

// ignored TableUp config
const { tableUpConfig, tableUpKeyboardControl } = generateTableUpShortKeyMenu(createSelectBox);
const quill1 = new Quill('#editor', {
  // ...
  modules: {
    // ...
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
  },
});
```
