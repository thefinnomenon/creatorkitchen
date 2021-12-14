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

const Tiptap = () => {
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
    content: `
      <h1>
        Header 1
      </h1>
      <h2>
        Header 2
      </h2>
      <h3>
        Header 3
      </h3>
      <h4>
        Header 4
      </h4>
      <p>
        this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
      </p>
      <ul>
        <li>
          That’s a bullet list with one …
        </li>
        <li>
          … or two list items.
        </li>
      </ul>
      <p>
        Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
      </p>
      <pre><code class="language-css">body {
  display: none;
}</code></pre>
      <p>
        I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
      </p>
      <blockquote>
        Wow, that’s amazing. Good work, boy! 👏
        <br />
        — Mom
      </blockquote>
    `,
    autofocus: true,
    editable: true,
    injectCSS: false,
  });

  useEffect(() => {
    if (editor && DEBUG) {
      applyDevTools(editor.view);
    }
  }, [editor]);

  return (
    <>
      {editor && <TextFloatingToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
