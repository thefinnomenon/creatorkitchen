import VisuallyHidden from '@reach/visually-hidden';
import API from '@aws-amplify/api';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import ContentList from '../components/ContentList';
import Editor from '../components/Editor';
import debounce from 'debounce';
import { createPost, deletePost, updatePost } from '../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { Auth } from 'aws-amplify';
import { getPost, postsByUsername } from '../graphql/queries';
import { signOut } from '../lib/amplify';
import Tiptap from '../components/TipTap';
import ContentSettingsPanel from '../components/ContentSettingsPanel';

const UPDATE_DEBOUNCE = 5000;

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

type Post = {
  id: string;
  title: string;
  content: string;
};

export default function EditPost() {
  const router = useRouter();
  //const { content_id } = router.query;
  //const [id, setId] = useState(content_id);
  const [posts, setPosts] = useState<Post[]>([]);
  const [post, setPost] = useState<Post>();
  const [isSaved, setIsSaved] = useState(true);
  const IdRef = useRef('');

  // CREATE
  async function onCreate() {
    const id = uuidv4();
    const res = await API.graphql({
      query: createPost,
      variables: {
        input: { id, title: '', description: '', content: '' },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });

    // @ts-ignore
    const newPost = res.data.createPost;

    debouncedUpdate.clear();
    setPosts([...posts, newPost]);
    setPost(newPost);
    IdRef.current = newPost.id;
  }

  const debouncedUpdate = useCallback(
    debounce((values) => onUpdate(values), UPDATE_DEBOUNCE),
    []
  );

  // UPDATE
  async function onUpdate(values) {
    if (!IdRef.current) return;
    const id = IdRef.current;

    // If title updated, optimistically update it in the content list
    if ('title' in values) {
      const postIndex = posts.findIndex((post) => post.id === IdRef.current);
      if (postIndex !== -1) posts[postIndex].title = values.title;
    }

    await API.graphql({
      query: updatePost,
      variables: {
        input: {
          id,
          ...values,
        },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });

    setIsSaved(true);
  }

  // DELETE
  async function onDelete(id) {
    await API.graphql({
      query: deletePost,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });

    const newPosts = posts.filter((post) => {
      return post.id !== id;
    });

    debouncedUpdate.clear();
    setPosts(newPosts);
    setPost(newPosts[0]);
    IdRef.current = newPosts[0].id;
  }

  // LOAD USER POST LIST ON MOUNT
  useEffect(() => {
    fetchPosts();
  }, []);

  // GET USER POSTS
  async function fetchPosts() {
    const { username } = await Auth.currentAuthenticatedUser();
    const postData = await API.graphql({
      query: postsByUsername,
      variables: { username },
    });
    // @ts-ignore
    setPosts(postData.data.postsByUsername.items);
  }

  // GET SELECTED POST
  async function onSelect(id) {
    try {
      const postData = await API.graphql({
        query: getPost,
        variables: { id },
      });

      // @ts-ignore
      const newPost = postData.data.getPost;

      debouncedUpdate.clear();
      setPost(newPost);
      IdRef.current = newPost.id;
    } catch (error) {
      console.log(error);
    }
  }

  // SIGNOUT
  async function onSignOut() {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.log('Failed to signout');
    }
  }

  return (
    <div className="w-full min-h-screen bg-white flex items-stretch justify-between">
      <div className="w-52">
        <ContentList
          content={posts}
          selectedId={post ? post.id : ''}
          onCreate={onCreate}
          onSelect={onSelect}
          onSignOut={onSignOut}
        />
      </div>
      <div className="md:mt-4 flex-1 max-w-4xl">
        {post && (
          <div className="flex items-center justify-between px-4">
            {isSaved ? <p className="text-gray-400">Saved</p> : <div />}

            <Link href={`/posts/${post.id}`} passHref>
              <a
                className="text-blue-600 font-semibold rounded-lg p-2 hover:bg-gray-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview
              </a>
            </Link>
          </div>
        )}
        {post && (
          <Tiptap
            content={post.content}
            onChange={(content) => {
              setIsSaved(false);
              debouncedUpdate({ content });
            }}
          />
        )}
      </div>
      {post && (
        <div className="w-52">
          <ContentSettingsPanel
            post={post}
            onUpdate={(values) => onUpdate(values)}
            setIsSaved={setIsSaved}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
}
