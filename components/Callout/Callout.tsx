import { Node } from '@tiptap/core';
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
  mergeAttributes,
  Editor,
} from '@tiptap/react';
import { MdAttractions, MdOutlineLightbulb } from 'react-icons/md';
import { FiAlertCircle, FiAlertTriangle, FiAlertOctagon } from 'react-icons/fi';
import VisuallyHidden from '@reach/visually-hidden';
import ReactDOMServer from 'react-dom/server';

export default Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      type: {
        default: 'note',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const dom = document.createElement('div');
    dom.innerHTML = ReactDOMServer.renderToStaticMarkup(
      // @ts-ignore
      <Callout editor={null} node={{ attrs: { ...HTMLAttributes } }} />
    );

    dom.setAttribute('data-type', this.name);
    Object.keys(HTMLAttributes).map((attribute) => {
      dom.setAttribute(attribute, HTMLAttributes[attribute]);
    });

    const contentDOM = dom.querySelector('[data-node-view-content]');

    return {
      dom,
      contentDOM,
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(Callout);
  },
});

type CalloutType = 'note' | 'tip' | 'warning' | 'important';

type Props = {
  editor: Editor | null;
  node: { attrs: { type: CalloutType } };
  updateAttributes({}): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export function Callout(props: Props): JSX.Element {
  const TYPES = {
    note: {
      style: 'bg-blue-100 border-blue-300',
      icon: <FiAlertCircle className="text-blue-300" />,
    },
    tip: {
      style: 'bg-green-100 border-green-300',
      icon: <MdOutlineLightbulb className="text-green-300" />,
    },
    warning: {
      style: 'bg-yellow-100 border-yellow-300',
      icon: <FiAlertTriangle className="text-yellow-300" />,
    },
    important: {
      style: 'bg-red-100 border-red-300',
      icon: <FiAlertOctagon className="text-red-300" />,
    },
  };

  const type = TYPES[props.node.attrs.type];

  const setCalloutType = () => {
    const types = Object.keys(TYPES);
    const nextType = types[types.indexOf(props.node.attrs.type) + 1];
    props.updateAttributes({
      type: nextType,
    });
  };

  return (
    <NodeViewWrapper className={`border-l-8 rounded-md ${type.style}`}>
      <button
        className="p-2 text-3xl"
        contentEditable={false}
        disabled={!props.editor || !props.editor.isEditable}
        onClick={setCalloutType}
      >
        {type.icon}
        {/* <VisuallyHidden>{props.node.attrs.type}</VisuallyHidden> */}
      </button>
      <NodeViewContent className="pb-2 px-10" />
    </NodeViewWrapper>
  );
}

Callout.defaultProps = defaultProps;
