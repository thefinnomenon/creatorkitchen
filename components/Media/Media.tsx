import { Node } from '@tiptap/core';
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
  mergeAttributes,
  Editor,
} from '@tiptap/react';
import { Tab } from '@headlessui/react';
import ReactDOMServer from 'react-dom/server';
import { RiLinkM } from 'react-icons/ri';
import LinkOrUpload from './LinkOrUpload';
import React from 'react';

export default Node.create({
  name: 'media',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      type: {
        default: '',
      },
      src: {
        default: '',
      },
      alt: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="media"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'media' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Media);
  },
});

type MediaType = 'image' | 'video';
export type MediaObject = {
  type: MediaType;
  src: string;
  alt: string;
};

type Props = {
  editor: Editor | null;
  node: { attrs: MediaObject };
  updateAttributes(media: MediaObject): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

const SOURCES = [
  // @ts-ignore
  { label: 'Link/Upload', icon: <RiLinkM />, panel: <LinkOrUpload /> },
  { label: 'Unsplash', icon: <RiLinkM />, panel: <div /> },
  { label: 'Giphy', icon: <RiLinkM />, panel: <div /> },
  { label: 'Memengine', icon: <RiLinkM />, panel: <div /> },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Media(props: Props): JSX.Element {
  const { type, src, alt } = props.node.attrs;
  console.log('attrs: ', type, src);

  const setMedia = (media: MediaObject) => {
    console.log(media);
    props.updateAttributes({
      type: media.type,
      src: media.src,
      alt: media.alt,
    });
  };

  if (!type) {
    return renderMediaInput(setMedia);
  }

  switch (type) {
    case 'image':
      return renderImage(src, alt);
    case 'video':
      return renderVideo(src);
    default:
      console.log('Type not supported');
      return <div>Type not supported</div>;
  }
}

const renderImage = (src, alt) => {
  return (
    <NodeViewWrapper contentEditable={false}>
      <div className="flex justify-center items-center object-none group">
        <div
          className="drag-handle"
          contentEditable="false"
          draggable="true"
          data-drag-handle
        />
        <img src={src} alt={alt} className="rounded-md shadow-2xl" />
      </div>
    </NodeViewWrapper>
  );
};

const renderVideo = (src) => {
  return (
    <NodeViewWrapper contentEditable={false}>
      <div className="flex justify-center items-center object-none group">
        <div
          className="drag-handle"
          contentEditable="false"
          draggable="true"
          data-drag-handle
        />
        <video src={src} className="rounded-md shadow-2xl" controls />
      </div>
    </NodeViewWrapper>
  );
};

const renderMediaInput = (setMedia) => (
  <NodeViewWrapper
    className="bg-gray-100 border-2 border-gray-200 rounded-sm shadow-lg overflow-hidden"
    contentEditable={false}
  >
    <Tab.Group>
      <Tab.List className="flex bg-gray-100 h-[2.5em] min-w-[600px] overflow-x-auto">
        {SOURCES.map(({ label }) => (
          <Tab
            key={label}
            contentEditable={false}
            className={({ selected }) =>
              classNames(
                'flex-1 font-medium bg-gray-100 border-b-2 border-gray-200',
                selected
                  ? 'text-blue-500 border-b-blue-500'
                  : 'hover:bg-gray-300'
              )
            }
          >
            {label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-2">
        {SOURCES.map(({ panel }, index) => (
          <Tab.Panel key={index} className="p-3">
            {React.cloneElement(panel, { setMedia })}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  </NodeViewWrapper>
);

Media.defaultProps = defaultProps;
