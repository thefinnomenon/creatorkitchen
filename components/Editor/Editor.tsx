import API from '@aws-amplify/api';
import { removeFile, removeTags, signOut } from '../../lib/amplify';
import { getPost, listPosts } from '../../graphql/queries';
import Tiptap from '../TipTap';
import { useEffect, useState } from 'react';
import debounce from 'debounce';
import { createPost, updatePost } from '../../graphql/mutations';
// @ts-ignore
import hljs from 'highlight.js';
import Auth from '@aws-amplify/auth';
import config from '../../aws-exports';

const SAVE_DEBOUNCE = 5000;

type Props = {
  id: string;
} & typeof defaultProps;

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

export default function EditPost({ id }: Props) {
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
    console.log('Fetch post for ', id);
    async function fetchPost() {
      try {
        const postData = await API.graphql({
          query: getPost,
          variables: { id },
        });
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

  useEffect(() => {
    debouncedUpdatePost();
  }, [content]);

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

  async function onChange(content) {
    setContent(content);
  }

  const debouncedUpdatePost = debounce(updateCurrentPost, SAVE_DEBOUNCE);

  async function updateCurrentPost() {
    console.log('Updating post ', content);
    if (!content) return;
    const oldMediaList = post.media;
    const media = updateMediaList(content);
    const newContent = highlightCodeblocks(content);
    const title = post.id;

    if (isNew) {
      await API.graphql({
        query: createPost,
        variables: {
          input: {
            ...post,
            content: newContent,
            media: formatMediaList(media),
            title,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });

      await handleMediaChanges(oldMediaList, media);
      setPost({ ...post, content: newContent, media });
      setIsNew(false);
      console.log('Saved new post ', id);
    } else {
      const postUpdated = {
        id: post.id,
        content: newContent,
        media: formatMediaList(media),
        title,
      };

      await API.graphql({
        query: updatePost,
        variables: {
          input: postUpdated,
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });

      await handleMediaChanges(oldMediaList, media);
      setPost({ ...post, content: newContent, media });
      console.log('Saved post ', id);
    }
  }

  return <>{post && <Tiptap content={post.content} onChange={onChange} />}</>;
}
