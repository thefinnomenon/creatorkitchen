import VisuallyHidden from '@reach/visually-hidden';
import API from '@aws-amplify/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import ContentList from '../components/ContentList';
import Editor from '../components/Editor';
import { createPost, deletePost, updatePost } from '../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { Auth } from 'aws-amplify';
import { getPost, postsByUsername } from '../graphql/queries';
import { signOut } from '../lib/amplify';

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function EditPost() {
  const router = useRouter();
  const { content_id } = router.query;
  const [id, setId] = useState(content_id);
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState();

  // CREATE
  async function onCreate() {
    const id = uuidv4();
    const res = await API.graphql({
      query: createPost,
      variables: {
        input: { title: 'Untitled', content: '', id },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });

    // @ts-ignore
    setPosts([...posts, res.data.createPost]);
    setId(id);
    // @ts-ignore
    setPost(res.data.createPost);
  }

  // UPDATE
  async function updateCurrentPost(p) {
    console.log('Updating post ', p.id);
    delete p.createdAt;
    delete p.updatedAt;

    await API.graphql({
      query: updatePost,
      variables: {
        input: p,
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });
  }

  // DELETE
  async function onDelete(id) {
    await API.graphql({
      query: deletePost,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });
    //setId('');
    console.log(id);
    const newPosts = posts.filter((post) => {
      return post.id !== id;
    });
    console.log(newPosts);

    setPosts(newPosts);
    setPost(newPosts[0]);
    setId(newPosts[0].id);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (post) updateCurrentPost(post);
  }, [post]);

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
      setPost({
        // @ts-ignore
        ...postData.data.getPost,
      });
      setId(id);
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
          selectedId={id as string}
          onCreate={onCreate}
          onSelect={onSelect}
          onSignOut={onSignOut}
        />
      </div>
      <div className="md:mt-4 flex-1 max-w-4xl">
        {id && (
          <div className="float-right">
            <Link href={`/posts/${id}`} passHref>
              <a
                className="text-blue-600 font-semibold px-8 rounded-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview
              </a>
            </Link>
            <button
              onClick={() => onDelete(id)}
              className="align-bottom pb-[0.15rem]"
            >
              <VisuallyHidden>Delete content</VisuallyHidden>
              <RiDeleteBinLine className="text-xl text-red-500" />
            </button>
          </div>
        )}
        {post && <Editor post={post} onChange={setPost} />}
      </div>
      <div className="w-28"></div>
    </div>
  );
}
