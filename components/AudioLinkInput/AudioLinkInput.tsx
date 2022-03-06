import { Editor, isTextSelection } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';
import { uploadFile, removeFile } from '../../lib/amplify';
import {
  RiLinkUnlinkM,
  RiPauseLine,
  RiPlayCircleLine,
  RiPlayLine,
} from 'react-icons/ri';
import { VscLinkExternal } from 'react-icons/vsc';
import ToolbarButton from '../ToolbarButton';

type File = {
  path: string;
  name: string;
};

type Props = {
  editor: Editor;
  audioLinkToolbar: any;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function AudioLinkInput({
  editor,
  audioLinkToolbar,
}: Props): JSX.Element {
  const { src, title } = editor.getAttributes('audiolink');
  const audioRef = useRef(new Audio(src));
  const [file, setFile] = useState<File>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [filename, setFilename] = useState(title);

  useEffect(() => {
    if (src) {
      audioRef.current = new Audio(src);
    }

    return function cleanup() {
      stopAudio();
    };
  }, [src]);

  useEffect(() => {
    if (title) {
      setFilename(title);
    }
  }, [title]);

  useEffect(() => {
    async function upload() {
      try {
        if (file) {
          const source = await uploadFile(file);
          editor
            .chain()
            .focus()
            .extendMarkRange('audiolink')
            .unsetLink()
            .setAudioLink({
              src: source,
              title: file.name,
            })
            .setTextSelection(editor.state.selection.$head.pos)
            .run();
        }
      } catch (error) {
        console.log(error);
      }
    }
    upload();
  }, [file]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  function shouldShow() {
    return ({ editor, view, state, oldState, from, to }) => {
      // Force hide
      if (audioLinkToolbar.current === 'hide') {
        stopAudio();
        return false;
      }

      // Sometime check for `empty` is not enough
      const isEmptyTextBlock =
        !state.doc.textBetween(from, to).length &&
        isTextSelection(state.selection);

      if (!view.hasFocus() || state.selection.empty || isEmptyTextBlock) {
        stopAudio();
        return false;
      }

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

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="audioLinkInput"
      tippyOptions={{
        maxWidth: '320px',
        placement: 'bottom',
        interactive: true,
      }}
      shouldShow={shouldShow()}
      className="bg-gray-100 text-lg rounded-sm shadow-lg"
    >
      <div className="flex items-center">
        <p
          className="appearance-none border bg-white rounded ml-2 mr-1 w-52  px-3 py-[2px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline whitespace-nowrap overflow-hidden text-ellipsis"
          // @ts-ignore
          placeholder={'Choose an audio file...'}
          onClick={() => {
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = 'audio/*';
            input.onchange = (_) => {
              const files = Array.from(input.files);
              if (files[0]) {
                // @ts-ignore
                setFile(files[0]);
              }
            };
            input.click();
          }}
        >
          {filename || 'Choose an audio file...'}
        </p>
        <ToolbarButton
          icon={isPlaying ? <RiPauseLine /> : <RiPlayLine />}
          onClick={() => {
            if (isPlaying) {
              stopAudio();
            } else {
              audioRef.current.play();
              setIsPlaying(true);
            }
          }}
          altText={isPlaying ? 'Stop audio' : 'Play audio'}
          disabled={!src}
          isActive={false}
        />
        <ToolbarButton
          icon={<VscLinkExternal />}
          onClick={() => openInNewTab(src)}
          altText="Open link to file"
          disabled={!src}
          isActive={false}
        />
        <ToolbarButton
          icon={<RiLinkUnlinkM />}
          onClick={() => {
            console.log('Deleting file ', file);
            file['key'] = src;
            removeFile(file);
            editor
              .chain()
              .focus()
              .extendMarkRange('audiolink')
              .unsetAudioLink()
              .run();
            setFilename('');
          }}
          altText="Remove"
          disabled={!src}
          isActive={false}
        />
      </div>
    </BubbleMenu>
  );
}

AudioLinkInput.defaultProps = defaultProps;
