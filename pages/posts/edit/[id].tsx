import API from '@aws-amplify/api';
import { removeFile, removeTags, signOut } from '../../../lib/amplify';
import { getPost, listPosts } from '../../../graphql/queries';
import Tiptap from '../../../components/TipTap';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createPost, updatePost } from '../../../graphql/mutations';
// @ts-ignore
import { lowlight } from 'lowlight';
import hljs from 'highlight.js';
import Auth from '@aws-amplify/auth';
import config from '../../../aws-exports';
import ContentList from '../../../components/ContentList';
import Editor from '../../../components/Editor';

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({
  post: null,
  isNew: false,
  preview: false,
});

export default function EditPost() {
  const router = useRouter();
  const [user, setUser] = useState();
  const [id, setId] = useState('');

  useEffect(() => {
    try {
      Auth.currentAuthenticatedUser().then((usr) => {
        setUser(usr);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-white flex items-stretch justify-between">
      <div className="flex-1">
        <ContentList onSelect={(id) => setId(id)} />
      </div>
      <div className="md:mt-4 flex-4 max-w-4xl min-w-0">
        {id && (
          <button
            className="text-blue-600 font-semibold px-8 rounded-lg float-right"
            onClick={() => router.push(`/posts/${id}`)}
          >
            Preview
          </button>
        )}
        {id && <Editor id={id as string} />}
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
