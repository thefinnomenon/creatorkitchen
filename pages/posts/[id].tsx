import API from '@aws-amplify/api';
import { route } from 'next/dist/server/router';
import { useRouter } from 'next/router';
import { getPost, listPosts } from '../../graphql/queries';
import Tiptap from '../../components/TipTap';

export default function Post({ post }) {
  const router = useRouter();
  const { id } = router.query;

  function navigateToEdit() {
    router.push(`/posts/edit/${id}`);
  }

  return (
    <>
      <button
        className="m-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={navigateToEdit}
      >
        Edit Post
      </button>
      <div className="w-full min-h-screen bg-gray-200 flex justify-center items-stretch">
        <div className="md:mt-4 flex-1 max-w-4xl min-w-0 bg-white shadow-xl">
          <div
            className="ProseMirror p-6 prose prose-md md:prose-lg lg:prose-xl xl:prose-2xl focus:outline-none center-editor"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {/* <Tiptap content={post.content} preview={true} onChange={() => {}} /> */}
        </div>
      </div>
    </>
  );
}

// This function gets called at build time
export async function getStaticProps({ params }) {
  const { id } = params;

  // Retrieve post from DynamoDB
  const postData = await API.graphql({
    query: getPost,
    variables: { id },
  });
  // @ts-ignore
  const post = postData.data.getPost;
  console.log('Retrieved Post');
  console.log(post.content);

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
}

// This function gets called at build time
export async function getStaticPaths() {
  // Retrieve posts from DynamoDB
  const postData = await API.graphql({
    query: listPosts,
  });

  // Map post list to paths
  // @ts-ignore
  const paths = postData.data.listPosts.items.map((post) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: 'blocking' };
}
