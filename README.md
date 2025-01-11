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

| attribute   | description             | type                              | default                 |
| ----------- | ----------------------- | --------------------------------- | ----------------------- |
| menuItems   | shortcut key menu items | `(MenuItems \| MenuItemsGroup)[]` | -                       |
| placeholder | line placeholder text   | `string`                          | `'Input / recall menu'` |

> I recommend using it with [quill-toolbar-tip](https://github.com/opentiny/quill-toolbar-tip) to prompt about the usage of shortcut keys.

<details>
  <summary> types </summary>

```ts
export interface MenuItems {
  type: 'item';
  name: string;
  alias: string[];
  icon?: string;
  title: string;
  descriptions?: string;
  handler: (this: Quill, item: MenuItems, range: Range | null, options?: any) => void;
}
export interface MenuItemsGroup {
  type: 'group';
  icon?: string;
  title: string;
  descriptions?: string;
  children: MenuItems[];
}
```

</details>
