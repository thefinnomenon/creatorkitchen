import { EditorContent, isTextSelection, useEditor } from '@tiptap/react';
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
import Keyboard from '../extensions/marks/keyboard';
import Command from '../extensions/nodes/command';
import Callout from '../components/Callout';
import Media from '../components/Media';
import suggestion from '../extensions/nodes/command/suggestion';
import { applyDevTools } from 'prosemirror-dev-toolkit';
import { useEffect, useRef, useState } from 'react';
import TextFloatingToolbar from './TextFloatingToolbar';
import LinkInput from './LinkInput';
import TableFloatingToolbar from './TableFloatingToolbar';

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

export type MenuState = 'show' | 'hide';

export default function Tiptap({ content, preview, onChange }) {
  const [previewContent, setPreviewContent] = useState('');
  const linkToolbar = useRef<MenuState>('hide');
  const tableToolbar = useRef<MenuState>('hide');
  const textToolbar = useRef<MenuState>('show');

  const editorClass =
    'p-6 prose prose-md md:prose-lg lg:prose-xl xl:prose-2xl focus:outline-none center-editor whitespace-pre-wrap';

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
      LinkWithShortcut.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
        lastColumnResizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Focus,
      Keyboard,
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
      // applyDevTools(editor.view);
    }
    if (editor) {
      onChange(editor.getHTML());
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!preview);
    }
  }, [editor, preview]);

  return (
    <>
      {editor && !preview && (
        <TextFloatingToolbar
          editor={editor}
          textToolbar={textToolbar}
          linkToolbar={linkToolbar}
        />
      )}
      {editor && !preview && (
        <LinkInput editor={editor} linkToolbar={linkToolbar} />
      )}
      {editor && !preview && (
        <TableFloatingToolbar editor={editor} toolbar={tableToolbar} />
      )}
      <EditorContent editor={editor} id="editor" />
    </>
  );
}

Tiptap.defaultProps = defaultProps;
