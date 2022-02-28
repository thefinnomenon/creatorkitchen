import API from '@aws-amplify/api';
import Tiptap from '../TipTap';
import { useEffect, useMemo, useState } from 'react';
import debounce from 'debounce';
import { updatePost } from '../../graphql/mutations';
// @ts-ignore
import hljs from 'highlight.js';

const SAVE_DEBOUNCE = 5000;

type Props = {
  post: any;
  onChange(post: any): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function EditPost({ post, onChange }: Props) {
  const [content, setContent] = useState(post.content);

  // Note: The v2 codeblock extension will output the styled
  //       code block and we can remove this ugly extra step
  const highlightCodeblocks = (content) => {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    doc.querySelectorAll('pre code').forEach((el) => {
      // @ts-ignore
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  useEffect(() => {
    console.log('Post changed, ', post.id);
    setContent(post.content);
  }, [post]);

  const handleOnChange = (newContent) => {
    console.log('Content changed, ', post.id);
    post.content = content;
    onChange({ ...post });
  };

  return <>{post && <Tiptap content={content} onChange={handleOnChange} />}</>;
}
