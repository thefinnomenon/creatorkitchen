import { useRouter } from 'next/router';
import { useState } from 'react';
import ContentList from '../components/ContentList';
import Editor from '../components/Editor';

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function EditPost() {
  const router = useRouter();
  const { content_id } = router.query;

  const [id, setId] = useState(content_id);

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
