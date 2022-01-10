import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { matchSorter } from 'match-sorter';
import CommandList from '../../../components/CommandList';

export type CommandListItem = {
  key: string;
  title: string;
  section: string;
};

export const suggestion = {
  items: ({ query }) => {
    const commands = [
      {
        key: 'p',
        title: 'Text',
        section: 'Basic',
      },
      {
        key: 'h1',
        title: 'Header 1',
        section: 'Basic',
      },
      {
        key: 'h2',
        title: 'Header 2',
        section: 'Basic',
      },
      {
        key: 'h3',
        title: 'Header 3',
        section: 'Basic',
      },
      {
        key: 'h4',
        title: 'Header 4',
        section: 'Basic',
      },
      {
        key: 'ul',
        title: 'Bulleted List',
        section: 'Basic',
      },
      {
        key: 'ol',
        title: 'Numbered List',
        section: 'Basic',
      },
      {
        key: 'blockquote',
        title: 'Block Quote',
        section: 'Basic',
      },
      {
        key: 'hr',
        title: 'Divider',
        section: 'Basic',
      },
      {
        key: 'callout',
        title: 'Callout',
        section: 'Basic',
      },
      {
        key: 'code',
        title: 'Code',
        section: 'Basic',
      },
      {
        key: 'table',
        title: 'Table',
        section: 'Basic',
      },
      {
        key: 'media',
        title: 'Media',
        section: 'Basic',
      },
    ];

    return matchSorter(commands, query, {
      keys: ['title'],
      baseSort: (a, b) => (a.index < b.index ? -1 : 1),
    });
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'top-start',
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

export default suggestion;
