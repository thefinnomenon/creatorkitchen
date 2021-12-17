import API from '@aws-amplify/api';
import { getPost, listPosts } from '../../../graphql/queries';
import Tiptap from '../../../components/TipTap';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createPost, updatePost } from '../../../graphql/mutations';

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({
  post: null,
  isNew: false,
  preview: false,
});

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(initialState.post);
  const [isNew, setIsNew] = useState(initialState.isNew);
  const [preview, setPreview] = useState(initialState.preview);

  useEffect(() => {
    fetchPost();
    async function fetchPost() {
      if (!id) return;
      const postData = await API.graphql({ query: getPost, variables: { id } });
      console.log('postData: ', postData);
      // If no previous postData -> this is a new post
      // @ts-ignore
      if (!postData.data.getPost) {
        setIsNew(true);
        setPost({ id, content: null });
      } else {
        // @ts-ignore
        setPost(postData.data.getPost);
      }
    }
  }, [id]);

  function onChange(content) {
    setPost(() => ({ ...post, content }));
  }

  async function updateCurrentPost() {
    if (!post.content) return;

    if (isNew) {
      await API.graphql({
        query: createPost,
        variables: { input: post },
      });
      setIsNew(false);
    } else {
      const postUpdated = {
        id,
        content: post.content,
      };

      await API.graphql({
        query: updatePost,
        variables: {
          input: postUpdated,
        },
      });
    }
  }

  function navigateToPost() {
    router.push(`/posts/${id}`);
  }

  function togglePreview() {
    setPreview(!preview);
  }

  return (
    <>
      <button
        className="m-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={updateCurrentPost}
      >
        Save Post
      </button>
      {post && !isNew && (
        <button
          className="m-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
          onClick={navigateToPost}
        >
          View Post
        </button>
      )}
      {/* <button
        className="m-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={togglePreview}
      >
        {preview ? 'Edit' : 'Preview'}
      </button> */}
      <div className="w-full min-h-screen bg-gray-200 flex justify-center items-stretch">
        <div className="md:mt-4 flex-1 max-w-4xl min-w-0 bg-white shadow-xl">
          {post && (
            <Tiptap
              content={post.content}
              preview={preview}
              onChange={onChange}
            />
          )}
        </div>
      </div>
    </>
  );
}
