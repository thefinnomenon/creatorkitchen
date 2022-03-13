import { Mark, mergeAttributes } from '@tiptap/core';

export interface TooltipOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tooltip: {
      setTooltip: (attributes: {
        'data-tooltip-content': string;
        activeLink: boolean;
      }) => ReturnType;
      toggleTooltip: (attributes: {
        'data-tooltip-content': string;
        activeLink: boolean;
      }) => ReturnType;
      unsetTooltip: () => ReturnType;
    };
  }
}

export const Tooltip = Mark.create<TooltipOptions>({
  name: 'tooltip',
  priority: 2000,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      'data-tooltip-content': {
        default: null,
      },
      activeLink: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="tooltip"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'tooltip',
        class: HTMLAttributes.activeLink ? '' : 'tooltip-underline',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setTooltip:
        (attributes) =>
        ({ chain }) => {
          console.log(attributes);
          return chain().setMark(this.name, attributes).run();
        },
      toggleTooltip:
        (attributes) =>
        ({ chain }) => {
          return chain()
            .toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
            .run();
        },
      unsetTooltip:
        () =>
        ({ chain }) => {
          return chain()
            .unsetMark(this.name, { extendEmptyMarkRange: true })
            .run();
        },
    };
  },
});
