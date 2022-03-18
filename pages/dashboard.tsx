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
import { FiExternalLink } from 'react-icons/fi';
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
  const [currentDraft, setCurrentDraft] = useState<Post>();
  const IdRef = useRef('');

  // CREATE
  async function onCreate() {
    if (!isSaved) {
      const cont = confirm(
        "Current draft isn't saved. Want to continue and lose changes?"
      );
      if (!cont) return;
      debouncedUpdate.clear();
      setIsSaved(true);
    }

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

    IdRef.current = newPost.id;
    setPosts([...posts, newPost]);
    setPost(newPost);
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
    setCurrentDraft({ ...currentDraft, ...values });
  }

  // DELETE
  async function onDelete(id) {
    debouncedUpdate.clear();
    setIsSaved(true);

    await API.graphql({
      query: deletePost,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });

    const newPosts = posts.filter((post) => {
      return post.id !== id;
    });

    IdRef.current = null;
    setPosts(newPosts);
    setPost(null);
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
      if (!isSaved) {
        const cont = confirm(
          "Current draft isn't saved. Want to continue and lose changes?"
        );
        if (!cont) return;
        debouncedUpdate.clear();
        setIsSaved(true);
      }

      const postData = await API.graphql({
        query: getPost,
        variables: { id },
      });

      // @ts-ignore
      const newPost = postData.data.getPost;

      IdRef.current = newPost.id;
      setPost(newPost);

      // Initialize any tooltips in the newly loaded content
      // setTimeout(() => tippy('[data-tippy-content]'), 500);
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
    <div className="w-full overflow-hidden h-screen bg-white flex justify-between">
      <div className="w-52">
        <ContentList
          content={posts}
          selectedId={post ? post.id : ''}
          onCreate={onCreate}
          onSelect={onSelect}
          onSignOut={onSignOut}
        />
      </div>
      <div className="md:mt-4 flex-1 items-stretch max-w-4xl">
        {post && (
          <div className="flex items-center justify-between px-4 pb-2">
            {isSaved ? <p className="text-gray-400">Saved</p> : <div />}
            <div className="flex items-stretch">
              <Link href={`/preview/${post.id}`} passHref>
                <a
                  className="text-blue-600 font-semibold rounded-lg p-2 hover:bg-gray-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!isSaved) {
                      const cont = alert(
                        "Current draft isn't saved. Please wait a few seconds."
                      );
                      e.preventDefault();
                      return false;
                    }
                  }}
                >
                  Preview
                </a>
              </Link>

              <button
                className="bg-blue-600 font-semibold text-white rounded-lg p-2 hover:bg-blue-500 mx-2"
                onClick={(e) => {
                  console.log('Publish changes');
                  // TODO: Create new published post from currentDraft values, with contentId and status published
                  // Need to keep createdAt (first draft created) publishedAt (first published), updatedAt (latest published)
                }}
              >
                Publish
              </button>
              <Link href={`/posts/${post.id}`} passHref>
                <a target="_blank" rel="noopener noreferrer">
                  <button
                  //disabled={disabled}
                  >
                    <VisuallyHidden>View published content</VisuallyHidden>
                    <FiExternalLink className="font-semibold text-4xl text-blue-600 rounded-lg p-2 hover:bg-gray-200" />
                  </button>
                </a>
              </Link>
            </div>
          </div>
        )}
        {post && (
          <div className="overflow-auto">
            <Tiptap
              content={post.content}
              onChange={(content) => {
                setIsSaved(false);
                debouncedUpdate({ content });
              }}
            />
          </div>
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
