# Quill-shortcut-key

A Quill plugin to format text or insert blot as short.

[demo](https://quill-modules.github.io/quill-shortcut-key/)

if you have better search algorithm, please submit a PR.

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

> To prevent overlap, quill's native placeholder will be disabled by css

## Options

| Attribute            | Description                                                                              | Type                                                                                           | Default                 |
| -------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------- |
| menuItems            | shortcut key menu items                                                                  | `(MenuItems \| MenuItemsGroup)[]`                                                              | -                       |
| placeholder          | line placeholder text                                                                    | `string \| (this:QuillShortcutKey) => string`                                                  | `'Input / recall menu'` |
| menuKeyboardControls | trigger when use keyboard select menu item. if return true will prevent move active item | `(event: KeyboardEvent, data: { currentMenu: HTMLElement; selectedIndex: number }) => boolean` | `() => false`           |

> I recommend using it with [quill-toolbar-tip](https://github.com/opentiny/quill-toolbar-tip) to prompt about the usage of shortcut keys.

<details>
  <summary> types </summary>

```ts
interface Range {
  index: number;
  length: number;
}
interface MenuEventData {
  data: MenuItemData;
  index: number;
  item: HTMLElement;
}
interface MenuCommonOptions {
  name: string; // short name
  alias: string[]; // search alias name
  hideSearch?: boolean; // if set true. search will not reach this item
  icon?: string;
  title?: string | ((this: QuillShortcutKey) => string);
  descriptions?: string | ((this: QuillShortcutKey) => string);
  content?: () => HTMLElement;
  classes?: string[]; // add on menu item. internal provide class 'no-active-style' to clear selectd background and color
  onClick?: (this: Quill, range: Range | null, data: MenuEventData) => void;
  onCloseSub?: (this: Quill, data: MenuEventData) => void;
  onOpenSub?: (this: Quill, data: MenuEventData) => void;
}
interface MenuItems extends MenuCommonOptions {
  type: 'item';
}
interface MenuItemsGroup extends MenuCommonOptions {
  type: 'group';
  children: (MenuItems | MenuItemsGroup)[];
}
```

</details>

## Customize

### Menu

pass array like `(MenuItems | MenuItemsGroup)[]` in option `menuItems` to customize menu item.

the menu item type `group` allow nesting item. but click handler will not close menu. only menu item type `item` will close menu after click.

```ts
const menu = {
  type: 'group' as const,
  name: 'first',
  title: 'first',
  onClick(this: Quill, range: Range | null, event: MenuEventData) {},
  children: [
    {
      type: 'group' as const,
      name: 'second',
      title: 'second',
      onClick(this: Quill, range: Range | null, event: MenuEventData) {},
      children: [
        {
          type: 'item' as const,
          name: 'third',
          title: 'third',
          onClick(this: Quill, range: Range | null, event: MenuEventData) {},
        },
      ]
    },
  ]
};
```

### Shortcut Key

same as the origin keyboard module binding options. [Keyboard Module](https://quilljs.com/docs/modules/keyboard)

## Other Module

### Color

because the origin quill color will changes with the movement of the cursor. so we need to save the last color that user select.

module `quill-easy-color` can do that. and it provide more powerful custom color picker. more info see [quill-table-up](https://github.com/quill-modules/quill-easy-color)

```ts
// pick one of the theme
import { EasyColorBubbleTheme, EasyColorSnowTheme } from 'quill-easy-color';
import QuillShortcutKey, { defaultMenuItems, generateTableUpShortKeyMenu } from 'quill-shortcut-key';

Quill.register({
  'themes/snow': EasyColorSnowTheme,
  'themes/bubble': EasyColorBubbleTheme,
}, true);
const { tableUpConfig, tableUpKeyboardControl } = generateTableUpShortKeyMenu(createSelectBox);
const quill1 = new Quill('#editor', {
  theme: 'snow',
  modules: {
    // ...
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
    'shortcut-key': {
      menuItems: defaultMenuItems,
    },
  },
});
```

### Table

use the module `quill-table-up`. you need install it first. more info see [quill-table-up](https://github.com/quill-modules/quill-table-up)

```ts
import QuillShortcutKey, { defaultMenuItems, generateTableUpShortKeyMenu } from 'quill-shortcut-key';
import { createSelectBox } from 'quill-table-up';

// ignored TableUp config and registe
const { tableUpConfig, tableUpKeyboardControl } = generateTableUpShortKeyMenu(createSelectBox);
const quill = new Quill('#editor', {
  // ...
  modules: {
    // ...
    'keyboard': {
      bindings: {
        ...defaultShortKey,
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
  },
});
```

### I18n

The plugin supports i18n through a [quill-i18n](https://github.com/quill-modules/quill-i18n)

```ts
import { I18n } from 'quill-i18n';
import QuillShortcutKey, { defaultI18nMenuItems, defaultI18nMessages, defaultI18nPlaceholder } from 'quill-shortcut-key';

Quill.register('modules/i18n', I18n);

const quill = new Quill('#editor', {
  modules: {
    'i18n': {
      locale: 'en-US',
      messages: {
        'en-US': {
          ...defaultI18nMessages['en-US'],
        },
        'zh-CN': {
          ...defaultI18nMessages['zh-CN'],
        },
      },
    },
    'shortcut-key': {
      menuItems: defaultI18nMenuItems,
      placeholder: defaultI18nPlaceholder,
    },
  },
});
```

#### Available Exports

| Export                   | Description                                  |
| ------------------------ | -------------------------------------------- |
| `defaultI18nMenuItems`   | Menu items with i18n support                 |
| `defaultI18nPlaceholder` | Placeholder function with i18n support       |
| `defaultI18nMessages`    | Default messages (en-US and zh-CN supported) |
| `I18N_KEYS`              | I18n key constants                           |

#### Supported Languages

- `en-US` (default fallback)
- `zh-CN`

You can extend the messages with your own translations([structure](https://github.com/quill-modules/quill-shortcut-key/blob/main/src/utils/supports/i18n.ts#L37-L84)):

```ts
import { defaultI18nMessages, I18N_KEYS } from 'quill-shortcut-key';

const customMessages = {
  ...defaultI18nMessages,
  'ja-JP': {
    'shortcut-key': {
      placeholder: 'コマンドのために / を入力',
      h1: { title: '見出し1' },
      // ... other translations
    },
  },
};
```
