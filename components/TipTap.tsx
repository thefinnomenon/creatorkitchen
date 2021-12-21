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
import Callout from '../components/Callout';
import suggestion from '../extensions/nodes/command/suggestion';
import { applyDevTools } from 'prosemirror-dev-toolkit';
import { useEffect, useState } from 'react';
import TextFloatingToolbar from './TextFloatingToolbar';

const DEBUG = process && process.env.NODE_ENV === 'development';

type Props = {
  content: string;
  onChange(value: string): void;
  preview: boolean;
} & typeof defaultProps;

const defaultProps = Object.freeze({
  preview: false,
});
const initialState = Object.freeze({});

export default function Tiptap({ content, preview, onChange }) {
  const [previewContent, setPreviewContent] = useState('');
  const editorClass =
    'p-6 prose prose-md md:prose-lg lg:prose-xl xl:prose-2xl focus:outline-none center-editor';

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
      Callout,
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
        class: editorClass,
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
      <div [data-type="callout"]></div>
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
      onChange(editor.getJSON());
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!preview);
    }
  }, [editor, preview]);

  return (
    <>
      {editor && !preview && <TextFloatingToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </>
  );
}

Tiptap.defaultProps = defaultProps;
