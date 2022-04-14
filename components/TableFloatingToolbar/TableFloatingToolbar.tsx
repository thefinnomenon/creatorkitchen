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
import {
  RiLinkM,
  RiInsertColumnLeft,
  RiDeleteColumn,
  RiInsertColumnRight,
  RiInsertRowTop,
  RiDeleteRow,
  RiInsertRowBottom,
  RiMergeCellsHorizontal,
  RiSplitCellsHorizontal,
  RiLayoutRowFill,
  RiLayoutColumnFill,
  RiDeleteBin6Line,
} from 'react-icons/ri';
import { BsFillStopFill } from 'react-icons/bs';
import ToolbarButton from '../ToolbarButton';
import { MutableRefObject } from 'react';

type Props = {
  editor: Editor;
  toolbar: MutableRefObject<string>;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function TableFloatingToolbar({ editor, toolbar }: Props): JSX.Element {
  function shouldShow() {
    return ({ editor: Editor, view, state, oldState, from, to }) => {
      // console.log(state.selection.anchor.path);
      // If selection in table -> show toolbar
      if (state.selection.$anchor.node(1) && state.selection.$anchor.node(1).type.name === 'table') {
        return true;
      }

      // Force hide
      if (toolbar.current === 'hide') return false;

      // Sometime check for `empty` is not enough
      const isEmptyTextBlock = !state.doc.textBetween(from, to).length && isTextSelection(state.selection);

      if (!view.hasFocus() || state.selection.empty || isEmptyTextBlock) return false;

      return true;
    };
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="tableToolbar"
      shouldShow={shouldShow()}
      tippyOptions={{
        maxWidth: '500px',
        placement: 'bottom',
      }}
      className="bg-gray-100 text-lg rounded-sm shadow-lg"
    >
      <ToolbarButton
        icon={<RiDeleteBin6Line />}
        altText="Delete Table"
        onClick={() => editor.chain().focus().deleteTable().run()}
      />
      <ToolbarButton
        icon={<RiInsertColumnLeft />}
        altText="Add Column Before"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
      />
      <ToolbarButton
        icon={<RiDeleteColumn />}
        altText="Delete Column"
        onClick={() => editor.chain().focus().deleteColumn().run()}
      />
      <ToolbarButton
        icon={<RiInsertColumnRight />}
        altText="Add Column After"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      />
      <ToolbarButton
        icon={<RiInsertRowTop />}
        altText="Add Row Before"
        onClick={() => editor.chain().focus().addRowBefore().run()}
      />
      <ToolbarButton
        icon={<RiDeleteRow />}
        altText="Delete Row"
        onClick={() => editor.chain().focus().deleteRow().run()}
      />
      <ToolbarButton
        icon={<RiInsertRowBottom />}
        altText="Add Row After"
        onClick={() => editor.chain().focus().addRowAfter().run()}
      />
      <ToolbarButton
        icon={<RiMergeCellsHorizontal />}
        altText="Merge Cells"
        onClick={() => editor.chain().focus().mergeCells().run()}
      />
      <ToolbarButton
        icon={<RiSplitCellsHorizontal />}
        altText="Split Cells"
        onClick={() => editor.chain().focus().splitCell().run()}
      />
      <ToolbarButton
        icon={<RiLayoutRowFill />}
        altText="Toggle Header Row"
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
      />
      <ToolbarButton
        icon={<RiLayoutColumnFill />}
        altText="Toggle Header Column"
        onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
      />
      <ToolbarButton
        icon={<BsFillStopFill />}
        altText="Toggle Header Cell"
        onClick={() => editor.chain().focus().toggleHeaderCell().run()}
      />
    </BubbleMenu>
  );
}

TableFloatingToolbar.defaultProps = defaultProps;
