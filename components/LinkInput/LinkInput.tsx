import { Editor, isTextSelection } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';
import { useState } from 'react';
import { RiLinkUnlinkM } from 'react-icons/ri';
import { VscLinkExternal } from 'react-icons/vsc';
import ToolbarButton from '../ToolbarButton';

type Props = {
  editor: Editor;
  linkToolbar: any;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function LinkInput({ editor, linkToolbar }: Props): JSX.Element {
  const [href, setHref] = useState(editor.getAttributes('link').href || '');

  function shouldShow() {
    return ({ editor, view, state, oldState, from, to }) => {
      // Force hide
      if (linkToolbar.current === 'hide') return false;

      // Sometime check for `empty` is not enough
      const isEmptyTextBlock =
        !state.doc.textBetween(from, to).length &&
        isTextSelection(state.selection);

      if (!view.hasFocus() || state.selection.empty || isEmptyTextBlock)
        return false;

      return true;
    };
  }

  const openInNewTab = (url: string): void => {
    const newWindow = window.open(
      url,
      '_blank',
      'noopener,noreferrer,nofollow'
    );
    if (newWindow) newWindow.opener = null;
  };

  const onKeyPressHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (href === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      // eslint-disable-next-line
      let src = ''
      const re = new RegExp('^http(s)?://.*');
      src = re.test(href) ? href : `http://${href}`;

      if (editor.isActive('tooltip')) {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetAudioLink()
          .setLink({ href })
          .setTooltip({
            'data-tooltip-content':
              editor.getAttributes('tooltip')['data-tooltip-content'],
            activeLink: true,
          })
          .setTextSelection(editor.state.selection.$head.pos)
          .run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetAudioLink()
          .setLink({ href })
          .setTextSelection(editor.state.selection.$head.pos)
          .run();
      }
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="linkInput"
      tippyOptions={{
        maxWidth: '320px',
        placement: 'bottom',
        interactive: true,
      }}
      shouldShow={shouldShow()}
      className="bg-gray-100 text-lg rounded-sm shadow-lg"
    >
      <div className="flex items-center" onBlur={() => setHref('')}>
        <input
          className="appearance-none border rounded ml-2 mr-1 w-52  px-3 py-[2px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="link"
          type="text"
          autoComplete="off"
          onKeyPress={onKeyPressHandler}
          value={href || editor.getAttributes('link').href || ''}
          // @ts-ignore
          onInput={(e) => setHref(e.target.value)}
          placeholder={'Enter a link...'}
        ></input>
        <ToolbarButton
          icon={<VscLinkExternal />}
          onClick={() => openInNewTab(editor.getAttributes('link').href)}
          altText="Open"
          disabled={!editor.getAttributes('link').href}
          isActive={false}
        />
        <ToolbarButton
          icon={<RiLinkUnlinkM />}
          onClick={() =>
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
          }
          altText="Remove"
          disabled={!editor.getAttributes('link').href}
          isActive={false}
        />
      </div>
    </BubbleMenu>
  );
}

LinkInput.defaultProps = defaultProps;
