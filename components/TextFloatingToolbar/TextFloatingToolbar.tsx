import { BubbleMenu } from '@tiptap/react';
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
import ToolbarButton from '../ToolbarButton';

type Props = {
  editor: Editor;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function TextFloatingToolbar({ editor }: Props): JSX.Element {
  return (
    <BubbleMenu
      editor={editor}
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
