import API from '@aws-amplify/api';
import { useRouter } from 'next/router';
import { getPost, listPosts } from '../../graphql/queries';
import Amplify from 'aws-amplify';
import config from '../../aws-exports';
Amplify.configure(config);
import Script from 'next/script';
import 'tippy.js/dist/svg-arrow.css';

type PostType = {
  id: string;
  content: string;
};

type Props = {
  post: PostType;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function Post({ post }: Props) {
  const router = useRouter();
  const { id } = router.query;

  if (!post.content) return null;

  return (
    <>
      <Script
        src="https://unpkg.com/@popperjs/core@2"
        strategy="beforeInteractive"
      />
      <Script src="https://unpkg.com/tippy.js@6" strategy="beforeInteractive" />
      <Script id="initialize-tooltips" strategy="afterInteractive">
        {`tippy('[data-tooltip-content]', { interactive: true, allowHTML: true, arrow: tippy.roundArrow, theme: 'my-tippy', onShow(instance) {
        instance.popper.hidden = instance.reference.dataset.tooltipContent ? false : true;
      	instance.setContent(instance.reference.dataset.tooltipContent);
      } })`}
      </Script>
      <div className="w-full min-h-screen bg-white flex justify-center items-stretch">
        <div className="md:mt-4 flex-1 max-w-4xl min-w-0 bg-white">
          {/* {id && (
          <button
            className="text-blue-600 font-semibold px-8 rounded-lg float-right"
            onClick={() => router.push(`/dashboard?content_id=${id}`)}
          >
            Edit
          </button>
        )} */}
          <div
            className="ProseMirror p-6 prose prose-md md:prose-lg lg:prose-xl xl:prose-2xl focus:outline-none center-editor"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </>
  );
}

// At build time, get post and pass as prop
export async function getStaticProps({ params }) {
  const { id } = params;
  console.log(id);

  try {
    const postData = (await API.graphql({
      query: getPost,
      variables: { id },
    })) as { data: { getPost: PostType } };

    return {
      props: {
        post: postData.data.getPost,
      },
      revalidate: 1,
    };
  } catch (error) {
    console.log(error);
  }
}

// At build time, get posts list and generate paths
export async function getStaticPaths() {
  try {
    const postData = (await API.graphql({
      query: listPosts,
    })) as { data: { listPosts: { items: [PostType] } } };

    const paths = postData.data.listPosts.items.map((post) => ({
      params: { id: post.id },
    }));
    console.log(paths);

    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.log(error);
  }
}
