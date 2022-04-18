import { EditorContent, isTextSelection, ReactNodeViewRenderer, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Focus from '@tiptap/extension-focus';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
// load all highlight.js languages
// @ts-ignore
import { lowlight } from 'lowlight';
import Keyboard from '../extensions/marks/keyboard';
import Command from '../extensions/nodes/command';
import Callout from '../components/Callout';
import Media from '../components/Media';
import suggestion from '../extensions/nodes/command/suggestion';
import { applyDevTools } from 'prosemirror-dev-toolkit';
import { useEffect, useMemo, useRef, useState } from 'react';
import TextFloatingToolbar from './TextFloatingToolbar';
import LinkInput from './LinkInput';
import TableFloatingToolbar from './TableFloatingToolbar';
import CodeBlock from './CodeBlock';
import TrailingNode from '../extensions/nodes/trailingNode';
import AudioLink from '../extensions/marks/audio';
import AudioLinkInput from './AudioLinkInput';
import Tooltip from '../extensions/marks/tooltip';
import TooltipUI from './TooltipUI';
import { ClipLoader } from 'react-spinners';
import { Site } from '../pages/home/dashboard';

const DEBUG = process && process.env.NODE_ENV === 'development';

type Props = {
  initialContent: string;
  onChange(site: Site, currIndex: string, value: string): void;
  preview: boolean;
} & typeof defaultProps;

const defaultProps = Object.freeze({
  preview: false,
});
const initialState = Object.freeze({});

export type MenuState = 'show' | 'hide';

// Note: The v2 codeblock extension will output the styled
//       code block and we can remove this ugly extra step
const highlightCodeblocks = (content) => {
  const doc = new DOMParser().parseFromString(content, 'text/html');
  doc.querySelectorAll('pre code').forEach((el) => {
    // @ts-ignore
    hljs.highlightElement(el);
  });
  return new XMLSerializer().serializeToString(doc);
};

export default function Tiptap({ initialContent, onChange, preview }) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const linkToolbar = useRef<MenuState>('hide');
  const audioLinkToolbar = useRef<MenuState>('hide');
  const tableToolbar = useRef<MenuState>('hide');
  const tooltip = useRef<MenuState>('hide');
  const textToolbar = useRef<MenuState>('show');

  const editorClass =
    'p-6 prose prose-md md:prose-lg lg:prose-xl xl:prose-2xl focus:outline-none center-editor whitespace-pre-wrap break-words';

  const LinkWithShortcut = Link.extend({
    // @ts-ignore
    addKeyboardShortcuts() {
      return {
        'Mod-k': () => {
          // Unset active link
          if (this.editor.isActive('link')) {
            this.editor.commands.unsetLink();
          } else {
            linkToolbar.current = 'show';
            textToolbar.current = 'hide';
            // This will cancel out, but will trigger the toolbar
            this.editor.commands.toggleLink({ href: '' });
            this.editor.commands.toggleLink({ href: '' });
            linkToolbar.current = 'hide';
            textToolbar.current = 'show';
          }
        },
      };
    },
  });

  const AudioLinkWithShortcut = AudioLink.extend({
    // @ts-ignore
    addKeyboardShortcuts() {
      return {
        'Mod-"': () => {
          // Unset active link
          if (this.editor.isActive('audiolink')) {
            this.editor.commands.unsetAudioLink();
          } else {
            audioLinkToolbar.current = 'show';
            textToolbar.current = 'hide';
            // This will cancel out, but will trigger the toolbar
            this.editor.commands.toggleAudioLink({ src: '', title: '' });
            this.editor.commands.toggleAudioLink({ src: '', title: '' });
            audioLinkToolbar.current = 'hide';
            textToolbar.current = 'show';
          }
        },
      };
    },
  });

  const TooltipWithShortcut = Tooltip.extend({
    // @ts-ignore
    addKeyboardShortcuts() {
      return {
        'Mod-/': () => {
          // Unset active tooltip
          if (this.editor.isActive('tooltip')) {
            this.editor.commands.unsetTooltip();
          } else {
            tooltip.current = 'show';
            textToolbar.current = 'hide';
            // This will cancel out, but will trigger the toolbar
            this.editor.commands.toggleTooltip({
              'data-tooltip-content': '',
              activeLink: false,
            });
            this.editor.commands.toggleTooltip({
              'data-tooltip-content': '',
              activeLink: false,
            });
            tooltip.current = 'hide';
            textToolbar.current = 'show';
          }
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        codeBlock: false,
      }),
      TrailingNode,
      Highlight,
      Typography,
      Underline,
      Subscript,
      Superscript,
      LinkWithShortcut.configure({
        openOnClick: false,
      }),
      AudioLinkWithShortcut,
      Table.configure({
        resizable: true,
        lastColumnResizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Focus,
      Keyboard,
      TooltipWithShortcut,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlock);
        },
      }).configure({
        lowlight,
        HTMLAttributes: {
          class: 'not-prose',
        },
      }),
      Callout,
      Media,
      Command.configure({
        suggestion,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        includeChildren: true,
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`;
          }

          return "Type '/' for commands";
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: editorClass,
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
    onBeforeCreate: ({ editor }) => {
      setIsLoading(true);
    },
    onCreate: ({ editor }) => {
      setIsLoading(false);
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    autofocus: true,
    editable: true,
    injectCSS: false,
  });

  // useEffect(() => {
  //   if (editor && DEBUG) {
  //     // applyDevTools(editor.view);
  //   }
  //   // if (editor) {
  //   //   onChange(editor.getHTML());
  //   // }
  // }, [editor]);

  // useEffect(() => {
  //   if (editor) {
  //     editor.setEditable(!preview);
  //   }
  // }, [editor, preview]);

  useEffect(() => {
    if (editor) {
      console.log('Setting editor content to ', initialContent);
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  // NOTE: This happens really quick so it's not worth even showing
  // the loader but to avoid a flash while it is laying out, we can
  // just render an empty div
  if (isLoading) return <div />;
  // return (
  //   <div className="h-screen flex justify-center items-center">
  //     <ClipLoader />
  //   </div>
  // );

  return (
    <>
      {editor && !preview && (
        <>
          <TextFloatingToolbar
            editor={editor}
            textToolbar={textToolbar}
            linkToolbar={linkToolbar}
            tooltip={tooltip}
            audioLinkToolbar={audioLinkToolbar}
          />
          <TableFloatingToolbar editor={editor} toolbar={tableToolbar} />
          <AudioLinkInput editor={editor} audioLinkToolbar={audioLinkToolbar} />
          <LinkInput editor={editor} linkToolbar={linkToolbar} />
          <TooltipUI editor={editor} tooltip={tooltip} />
        </>
      )}
      <EditorContent editor={editor} id="editor" />
    </>
  );
}

Tiptap.defaultProps = defaultProps;
