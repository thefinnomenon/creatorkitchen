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
import Link from './Link';
import React, { useEffect, useState } from 'react';
import Unsplash from './Unsplash';

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
    const dom = document.createElement('div');
    const contentDom = document.createElement('div');
    dom.innerHTML = ReactDOMServer.renderToStaticMarkup(
      // @ts-ignore
      <Media editor={null} node={{ attrs: { ...HTMLAttributes } }} />
    );

    dom.setAttribute('data-type', this.name);
    Object.keys(HTMLAttributes).map((attribute) => {
      dom.setAttribute(attribute, HTMLAttributes[attribute]);
    });

    //console.log(dom);

    return {
      dom,
      contentDom,
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(Media);
  },
});

type MediaType = 'image' | 'video' | 'embed';
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
  { label: 'Link', icon: <RiLinkM />, panel: <Link /> },
  { label: 'Upload', icon: <RiLinkM />, panel: <div /> },
  // @ts-ignore
  { label: 'Unsplash', icon: <RiLinkM />, panel: <Unsplash /> },
  { label: 'Giphy', icon: <RiLinkM />, panel: <div /> },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Media(props: Props): JSX.Element {
  const { type, src, alt } = props.node.attrs;
  //console.log('attrs: ', type, src);

  const setMedia = (media: MediaObject) => {
    //console.log(media);
    props.updateAttributes({
      type: media.type,
      src: media.src,
      alt: media.alt,
    });
  };

  if (!src) {
    return renderMediaInput(setMedia);
  }

  switch (type) {
    case 'image':
      return renderImage(src, alt);
    case 'video':
      return renderVideo(src);
    default:
      return renderEmbed(src);
  }
}

const renderEmbed = (src) => {
  const API_KEY = process.env.NEXT_PUBLIC_IFRAMELY_API_KEY;

  return (
    <NodeViewWrapper contentEditable={false}>
      <div contentEditable={false} data-drag-handle className="">
        <div className="iframely-embed " contentEditable={false}>
          <div className="iframely-responsive" contentEditable={false}>
            <iframe
              contentEditable={false}
              src={`https://cdn.iframe.ly/api/iframe?app=1&url=${src}&key=${API_KEY}&lazy=1&iframe=1&omit_script=1&omit_css=true`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

const renderImage = (src, alt) => {
  return (
    <NodeViewWrapper contentEditable={false}>
      <div
        contentEditable={false}
        data-drag-handle
        className="flex justify-center object-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          contentEditable={false}
          src={src}
          alt={alt}
          className="rounded-md shadow-2xl"
        />
      </div>
    </NodeViewWrapper>
  );
};

const renderVideo = (src) => {
  return (
    <NodeViewWrapper contentEditable={false}>
      <div
        data-drag-handle
        className="flex justify-center items-center object-none group"
      >
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
