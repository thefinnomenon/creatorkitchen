import { BubbleMenu, isTextSelection } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import { BiHighlight, BiCodeAlt } from 'react-icons/bi';
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatStrikethrough,
  MdKeyboard,
  MdSubscript,
  MdSuperscript,
} from 'react-icons/md';
import { RiLinkM } from 'react-icons/ri';
import ToolbarButton from '../ToolbarButton';
import { MutableRefObject } from 'react';

type Props = {
  editor: Editor;
  textToolbar: MutableRefObject<string>;
  linkToolbar: MutableRefObject<string>;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function TextFloatingToolbar({
  editor,
  textToolbar,
  linkToolbar,
}: Props): JSX.Element {
  function shouldShow() {
    return ({ editor, view, state, oldState, from, to }) => {
      // Force show
      // if (textToolbar.current === 'show') return true;

      // Force hide
      if (textToolbar.current === 'hide') return false;

      // If codeblock -> Hide
      if (editor.isActive('codeBlock')) return false;

      // If media -> Hide
      if (state.selection.node) {
        const type = state.selection.node.type.name;
        if (type === 'media') return false;
      }

      // Sometime check for `empty` is not enough
      const isEmptyTextBlock =
        !state.doc.textBetween(from, to).length &&
        isTextSelection(state.selection);

      if (!view.hasFocus() || state.selection.empty || isEmptyTextBlock)
        return false;

      return true;
    };
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="textToolbar"
      shouldShow={shouldShow()}
      tippyOptions={{ maxWidth: '500px' }}
      className="bg-gray-100 text-lg rounded-sm shadow-lg"
    >
      <ToolbarButton
        icon={<MdFormatBold />}
        altText="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      />
      <ToolbarButton
        icon={<MdFormatItalic />}
        altText="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      />
      <ToolbarButton
        icon={<MdFormatUnderlined />}
        altText="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
      />
      <ToolbarButton
        icon={<MdFormatStrikethrough />}
        altText="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
      />
      <ToolbarButton
        icon={<BiHighlight />}
        altText="Highlight"
        onClick={() => editor.commands.toggleHighlight()}
        isActive={editor.isActive('highlight')}
      />
      <ToolbarButton
        icon={<BiCodeAlt />}
        altText="Code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
      />
      <ToolbarButton
        icon={<MdKeyboard />}
        altText="Keyboard"
        onClick={() => editor.chain().focus().toggleKeyboard().run()}
        isActive={editor.isActive('keyboard')}
      />
      <ToolbarButton
        icon={<RiLinkM />}
        altText="Link"
        onClick={() => {
          textToolbar.current = 'hide';
          linkToolbar.current = 'show';
          editor.chain().focus().run();
          // HACK: I don't love this, but it works for now...
          setTimeout(() => {
            textToolbar.current = 'show';
            linkToolbar.current = 'hide';
          }, 200);
        }}
        isActive={editor.getAttributes('link').href}
      />
      <ToolbarButton
        icon={<MdSubscript />}
        altText="Subscript"
        onClick={() => {
          editor.commands.unsetSuperscript();
          editor.commands.toggleSubscript();
        }}
        isActive={editor.isActive('subscript')}
        isGroupStart
      />
      <ToolbarButton
        icon={<MdSuperscript />}
        altText="Superscript"
        onClick={() => {
          editor.commands.unsetSubscript();
          editor.commands.toggleSuperscript();
        }}
        isActive={editor.isActive('superscript')}
      />
      <ToolbarButton
        icon={<MdFormatAlignLeft />}
        altText="Align Left"
        onClick={() => editor.commands.setTextAlign('left')}
        isActive={editor.isActive({ textAlign: 'left' })}
        isGroupStart
      />
      <ToolbarButton
        icon={<MdFormatAlignCenter />}
        altText="Align Center"
        onClick={() => editor.commands.setTextAlign('center')}
        isActive={editor.isActive({ textAlign: 'center' })}
      />
      <ToolbarButton
        icon={<MdFormatAlignRight />}
        altText="Align Right"
        onClick={() => editor.commands.setTextAlign('right')}
        isActive={editor.isActive({ textAlign: 'right' })}
      />
      <ToolbarButton
        icon={<MdFormatAlignJustify />}
        altText="Align Justify"
        onClick={() => editor.commands.setTextAlign('justify')}
        isActive={editor.isActive({ textAlign: 'justify' })}
      />
    </BubbleMenu>
  );
}

TextFloatingToolbar.defaultProps = defaultProps;
