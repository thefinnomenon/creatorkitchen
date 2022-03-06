import { Mark } from '@tiptap/core';

export interface AudioLinkOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    audiolink: {
      setAudioLink: (attributes: { src: string; title: string }) => ReturnType;
      toggleAudioLink: (attributes: {
        src: string;
        title: string;
      }) => ReturnType;
      unsetAudioLink: () => ReturnType;
    };
  }
}

export const AudioLink = Mark.create<AudioLinkOptions>({
  name: 'audiolink',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="audiolink"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const span = document.createElement('span');
    span.setAttribute('data-type', this.name);
    span.setAttribute(
      'onclick',
      `Array.from(document.getElementsByTagName('audio')).forEach(audio => { audio.pause(); audio.currentTime = 0; }); const audio = document.getElementById("${HTMLAttributes.src}"); if(audio) audio.play();`
    );

    const audio = document.createElement('audio');
    audio.id = HTMLAttributes.src;
    audio.src = HTMLAttributes.src;
    audio.preload = 'auto';
    span.appendChild(audio);

    Object.keys(HTMLAttributes).map((attribute) => {
      span.setAttribute(attribute, HTMLAttributes[attribute]);
    });

    // return [
    //   'span',
    //   mergeAttributes(HTMLAttributes, { 'data-type': 'audiolink', 'onclick': '' }),
    //   0,
    // ];
    return {
      dom: span,
    };
  },

  addCommands() {
    return {
      setAudioLink:
        (attributes) =>
        ({ chain }) => {
          return chain().setMark(this.name, attributes).run();
        },

      toggleAudioLink:
        (attributes) =>
        ({ chain }) => {
          return chain()
            .toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
            .run();
        },

      unsetAudioLink:
        () =>
        ({ chain }) => {
          return chain()
            .unsetMark(this.name, { extendEmptyMarkRange: true })
            .run();
        },
    };
  },
});
