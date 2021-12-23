import { Node, mergeAttributes } from '@tiptap/core';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { PluginKey } from 'prosemirror-state';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';

export type CommandOptions = {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: {
    options: CommandOptions;
    node: ProseMirrorNode;
  }) => string;
  suggestion: Omit<SuggestionOptions, 'editor'>;
};

export const CommandPluginKey = new PluginKey('command');

export const Command = Node.create<CommandOptions>({
  name: 'command',

  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ options, node }) {
        return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
      },
      suggestion: {
        char: '/',
        pluginKey: CommandPluginKey,
        command: ({ editor, range, props }) => {
          const { section, type } = props;

          switch (type) {
            case 'p':
              editor.chain().focus().deleteRange(range).setParagraph().run();
              break;
            case 'h1':
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHeading({ level: 1 })
                .run();
              break;
            case 'h2':
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHeading({ level: 2 })
                .run();
              break;
            case 'h3':
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHeading({ level: 3 })
                .run();
              break;
            case 'h4':
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHeading({ level: 4 })
                .run();
              break;
            case 'h4':
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHeading({ level: 4 })
                .run();
              break;
            case 'ul':
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBulletList()
                .run();
              break;
            case 'ol':
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleOrderedList()
                .run();
              break;
            case 'blockquote':
              editor.chain().focus().deleteRange(range).setBlockquote().run();
              break;
            case 'codeblock':
              editor.chain().focus().deleteRange(range).setCodeBlock().run();
              break;
            case 'hr':
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHorizontalRule()
                .run();
              break;
            case 'callout':
              editor.chain().focus().deleteRange(range).wrapIn('callout').run();
              break;
            case 'media':
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent({
                  type: 'media',
                })
                .run();
              break;
            default:
              console.log('Command not implemented yet');
          }
        },
        allow: ({ editor, range }) => {
          const $from = editor.state.doc.resolve(range.from);
          const type = editor.schema.nodes[this.name];
          const allow = !!$from.parent.type.contentMatch.matchType(type);

          return allow;
        },
      },
    };
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            'data-id': attributes.id,
          };
        },
      },

      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }

          return {
            'data-label': attributes.label,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        { 'data-type': this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      this.options.renderLabel({
        options: this.options,
        node,
      }),
    ];
  },

  renderText({ node }) {
    return this.options.renderLabel({
      options: this.options,
      node,
    });
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isCommand = false;
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isCommand = true;
              tr.insertText(
                this.options.suggestion.char || '',
                pos,
                pos + node.nodeSize
              );

              return false;
            }
          });

          return isCommand;
        }),
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
