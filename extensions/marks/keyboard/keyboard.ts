import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from '@tiptap/core';

export interface KeyboardOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    keyboard: {
      setKeyboard: () => ReturnType;
      toggleKeyboard: () => ReturnType;
      unsetKeyboard: () => ReturnType;
    };
  }
}

export const inputRegex = /(?:^|\s)((?:\[\[)((?:[^*]+))(?:\]\]))$/;
export const pasteRegex = /(?:^|\s)((?:\[\[)((?:[^*]+))(?:\]\]))/g;

export const Keyboard = Mark.create<KeyboardOptions>({
  name: 'keyboard',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'kbd',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'kbd',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setKeyboard:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      toggleKeyboard:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
      unsetKeyboard:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-'": () => this.editor.commands.toggleKeyboard(),
    };
  },

  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ];
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type,
      }),
    ];
  },
});
