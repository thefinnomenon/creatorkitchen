import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import Keyboard from '../extensions/marks/keyboard';
import Command from '../extensions/nodes/command';
import suggestion from '../extensions/nodes/command/suggestion';
import { applyDevTools } from 'prosemirror-dev-toolkit';
import { useEffect } from 'react';
import TextFloatingToolbar from './TextFloatingToolbar';

const DEBUG = process && process.env.NODE_ENV === 'development';

type Props = {
  content: string;
  onChange(value: string): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function Tiptap({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Highlight,
      Typography,
      Underline,
      Subscript,
      Superscript,
      Focus,
      Keyboard,
      Command.configure({
        suggestion,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
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
        class:
          'p-6 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
    content: content
      ? content
      : `
      <h1>
        Welcome to Creator Kitchen
      </h1>
      <p>
        Type <code>/</code> to add different blocks or elect some text to access the toolbar to set (<strong>bold</strong>, <em>italics</em>, etc). The editor also supports markdown syntax -- try typing <code>#</code> followed by a space in an empty block.
      </p>
    `,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    autofocus: true,
    editable: true,
    injectCSS: false,
  });

  useEffect(() => {
    if (editor && DEBUG) {
      applyDevTools(editor.view);
    }
    if (editor) {
      onChange(editor.getHTML());
    }
  }, [editor]);

  return (
    <>
      {editor && <TextFloatingToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </>
  );
}

Tiptap.defaultProps = defaultProps;
