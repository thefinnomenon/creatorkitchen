import { Editor, isTextSelection } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';
import { roundArrow } from 'tippy.js';
import 'tippy.js/dist/svg-arrow.css';

type Props = {
  editor: Editor;
  tooltip: any;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function Tooltip({ editor, tooltip }: Props): JSX.Element {
  const contentEditableRef = useRef();
  // const [contentEditable, setContentEditable] = useState(
  //   document.querySelector('#tooltip-contenteditable')
  // );

  useEffect(() => {
    if (contentEditableRef.current) {
      // @ts-ignore
      contentEditableRef.current.innerHTML =
        editor.getAttributes('tooltip')['data-tooltip-content'] || '';
    }
  }, [tooltip.current]);

  function shouldShow() {
    return ({ editor: Editor, view, state, oldState, from, to }) => {
      // Force hide
      if (tooltip.current === 'hide') return false;

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
      pluginKey="tooltip"
      tippyOptions={{
        maxWidth: '500px',
        placement: 'top',
        interactive: true,
        arrow: roundArrow,
        theme: 'my-tippy',
        animation: 'fade',
      }}
      shouldShow={shouldShow()}
      // className="focus-within:ring-4"
    >
      <div
        ref={contentEditableRef}
        contentEditable="true"
        className="p-1 align-center text-center min-w-[40px] max-w-xs text-white focus:outline-0"
        onBlur={(event) => {
          // Set/Update tooltip content or clear mark if empty
          if (event.target.innerHTML) {
            editor
              .chain()
              .focus()
              .extendMarkRange('tooltip')
              .setTooltip({
                'data-tooltip-content': event.target.innerHTML,
                activeLink:
                  editor.isActive('link') || editor.isActive('audiolink'),
              })
              .setTextSelection(editor.state.selection.$head.pos)
              .run();
          } else {
            editor
              .chain()
              .focus()
              .extendMarkRange('tooltip')
              .unsetTooltip()
              .setTextSelection(editor.state.selection.$head.pos)
              .run();
          }
        }}
      />
    </BubbleMenu>
  );
}

Tooltip.defaultProps = defaultProps;
