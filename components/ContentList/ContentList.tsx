import { API, Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { postsByUsername } from '../../graphql/queries';
import { deletePost as deletePostMutation } from '../../graphql/mutations';
import router from 'next/router';
import { signOut } from '../../lib/amplify';

type Props = {
  onSelect(id: string): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function ContentList({ onSelect }: Props): JSX.Element {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { username } = await Auth.currentAuthenticatedUser();
    const postData = await API.graphql({
      query: postsByUsername,
      variables: { username },
    });
    // @ts-ignore
    setPosts(postData.data.postsByUsername.items);
  }

  async function deletePost(id) {
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });
    fetchPosts();
  }

  const handleOnClick = (index) => {
    setSelectedPost(index);
    onSelect(posts[index].id);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.log('Failed to signout');
    }
  };

  return (
    <div className="h-full max-w-md bg-gray-100 shadow-md">
      <h1 className="text-3xl font-semibold tracking-wide mb-4 pt-4 pl-4">
        Posts
      </h1>
      {posts.map((post, index) => (
        <div
          key={index}
          onClick={() => handleOnClick(index)}
          className={`overflow-y-auto cursor-pointer p-4 hover:bg-gray-300 ${
            index === selectedPost ? 'font-bold bg-gray-300' : ''
          }`}
        >
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-500 mt-2 mb-2">Author: {post.username}</p>
        </div>
      ))}
      <div className="fixed bottom-2 left-2">
        <button
          className="ml-auto mr-0 bg-blue-600 text-white font-semibold px-8 rounded-lg w-40 h-8"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

ContentList.defaultProps = defaultProps;
