import Quill from 'quill';

const icons = Quill.import('ui/icons') as Record<string, any>;

export const defaultMenuItems = [
  {
    name: 'h1',
    alias: ['header', 'head', 'head1'],
    icons: icons.header['1'],
    title: '标题1',
    handler(this: Quill) {
      const range = this.getSelection();
      if (!range) return;
      this.insertEmbed(range.index, 'header', '1', Quill.sources.USER);
    },
  },
  {
    name: 'h2',
    alias: ['header', 'head', 'head2'],
    icons: icons.header['2'],
    title: '标题2',
    handler(this: Quill) {
      const range = this.getSelection();
      if (!range) return;
      this.insertEmbed(range.index, 'header', '2', Quill.sources.USER);
    },
  },
  {
    name: 'h3',
    alias: ['header', 'head', 'head3'],
    icons: icons.header['3'],
    title: '标题3',
    handler(this: Quill) {
      const range = this.getSelection();
      if (!range) return;
      this.insertEmbed(range.index, 'header', '3', Quill.sources.USER);
    },
  },
];
