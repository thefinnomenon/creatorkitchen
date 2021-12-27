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
import Giphy from './Giphy';
import Upload from './Upload';

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
      caption: {
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

    const contentDOM = dom.querySelector('[data-node-view-content]');

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
  caption: string;
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
  // @ts-ignore
  { label: 'Upload', icon: <RiLinkM />, panel: <Upload /> },
  // @ts-ignore
  { label: 'Unsplash', icon: <RiLinkM />, panel: <Unsplash /> },
  // @ts-ignore
  { label: 'Giphy', icon: <RiLinkM />, panel: <Giphy /> },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const API_KEY = process.env.NEXT_PUBLIC_IFRAMELY_API_KEY;

export function Media(props: Props): JSX.Element {
  const editing = props.editor && props.editor.isEditable;
  const { type, src, alt } = props.node.attrs;

  const setMedia = (media: MediaObject) => {
    props.updateAttributes({
      type: media.type,
      src: media.src,
      alt: media.alt,
      caption: media.caption || '',
    });
  };

  if (!src) return renderMediaInput(setMedia);

  let embed;
  switch (type) {
    case 'image':
      embed = <img src={src} className="embed not-prose" alt={alt} />;
      break;
    case 'video':
      embed = <video src={src} className="embed not-prose" controls />;
      break;
    default:
      embed = (
        <div className="flex-1 iframely-embed embed">
          <div className="iframely-responsive">
            <iframe
              src={`https://cdn.iframe.ly/api/iframe?app=1&url=${src}&key=${API_KEY}&lazy=1&iframe=1&omit_script=1&omit_css=true`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      );
  }

  return (
    <NodeViewWrapper contentEditable={false} className="mb-8">
      <div className="flex justify-center items-center">
        {editing && <div data-drag-handle className="drag-handle" />}
        {embed}
      </div>
      <div
        contentEditable={false}
        className="w-full text-center text-sm text-gray-500"
      >
        <div
          className="mt-[-1rem]"
          dangerouslySetInnerHTML={{ __html: props.node.attrs.caption }}
        />
      </div>
    </NodeViewWrapper>
  );
}

const renderMediaInput = (setMedia) => (
  <NodeViewWrapper
    className="bg-gray-100 border-2 border-gray-200 rounded-sm shadow-lg overflow-hidden mb-8"
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
      <Tab.Panels className="my-2 min-h-[8rem]">
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
