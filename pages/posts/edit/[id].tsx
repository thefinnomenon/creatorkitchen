import API from '@aws-amplify/api';
import { removeFile, removeTags, signOut } from '../../../lib/amplify';
import { getPost, listPosts } from '../../../graphql/queries';
import Tiptap from '../../../components/TipTap';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createPost, updatePost } from '../../../graphql/mutations';
import Auth from '@aws-amplify/auth';
import config from '../../../aws-exports';

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({
  post: null,
  isNew: false,
  preview: false,
});

const updateMediaList = (content: string) => {
  const mediaRegex = new RegExp(
    `https:\/\/(${config.aws_user_files_s3_bucket}).(.?[^\/]*)\/([^"]*)`,
    'gm'
  );

  // @ts-ignore
  const matches = [...content.matchAll(mediaRegex)];

  const media = matches.map((match, index) => {
    return { bucket: match[1], key: match[3] };
  });

  // Note: Skip every other to remove duplicates do to wrapping div references src
  return media.filter((element, index) => {
    return index % 2 === 0;
  });
};

const handleMediaChanges = async (oldMedia, newMedia) => {
  // Delete saved media that user removed
  if (oldMedia) {
    await oldMedia.map(async (media) => {
      if (
        !newMedia ||
        !newMedia.some((elem) => {
          return JSON.stringify(media) === JSON.stringify(elem);
        })
      ) {
        await removeFile(media);
      }
    });
  }

  // Remove unsaved tag from new media
  if (newMedia) {
    await newMedia.map(async (media) => {
      if (
        !oldMedia ||
        !oldMedia.some((elem) => {
          return JSON.stringify(media) === JSON.stringify(elem);
        })
      ) {
        await removeTags(media);
      }
    });
  }
};

const formatMediaList = (media) => {
  return media ? JSON.stringify(media) : null;
};

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState();
  const [post, setPost] = useState(initialState.post);
  const [isNew, setIsNew] = useState(initialState.isNew);
  const [content, setContent] = useState('');

  useEffect(() => {
    try {
      Auth.currentAuthenticatedUser().then((usr) => {
        setUser(usr);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const postData = await API.graphql({
          query: getPost,
          variables: { id },
        });
        // console.log('postData: ', postData);
        // If no previous postData -> this is a new post
        // @ts-ignore
        if (!postData.data.getPost) {
          setIsNew(true);
          setPost({ id, content: null, media: null });
        } else {
          setPost({
            // @ts-ignore
            ...postData.data.getPost,
            // @ts-ignore
            media: JSON.parse(postData.data.getPost.media),
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchPost();
  }, [id]);

  function onChange(content) {
    setContent(content);
  }

  async function updateCurrentPost() {
    if (!content) return;
    const oldMediaList = post.media;
    const media = updateMediaList(content);

    if (isNew) {
      await API.graphql({
        query: createPost,
        variables: {
          input: { ...post, content, media: formatMediaList(media) },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });

      await handleMediaChanges(oldMediaList, media);
      setPost({ ...post, content, media });
      setIsNew(false);
    } else {
      const postUpdated = {
        id,
        content: content,
        media: formatMediaList(media),
      };

      await API.graphql({
        query: updatePost,
        variables: {
          input: postUpdated,
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });

      await handleMediaChanges(oldMediaList, media);
      setPost({ ...post, content, media });
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.log('Failed to signout');
    }
  }

  function navigateToPost() {
    router.push(`/posts/${id}`);
  }

  return (
    <>
      {user && (
        <div className="flex justify-start h-20 p-4 gap-4">
          <button
            className="bg-blue-600 text-white font-semibold px-8 rounded-lg"
            onClick={updateCurrentPost}
          >
            Save Post
          </button>
          {post && !isNew && (
            <button
              className="bg-blue-600 text-white font-semibold px-8 rounded-lg"
              onClick={navigateToPost}
            >
              View Post
            </button>
          )}
          <button
            className="ml-auto mr-0 bg-blue-600 text-white font-semibold px-8 rounded-lg"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
      <div className="w-full min-h-screen bg-gray-200 flex justify-center items-stretch">
        <div className="md:mt-4 flex-1 max-w-4xl min-w-0 bg-white shadow-xl">
          {post && <Tiptap content={post.content} onChange={onChange} />}
        </div>
      </div>
    </>
  );
}
