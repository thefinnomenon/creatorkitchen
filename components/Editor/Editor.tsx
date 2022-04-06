import Tiptap from '../TipTap';

const SAVE_DEBOUNCE = 5000;

type Props = {
  initialContent: string;
  post: any;
  onChange(): void;
} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function EditPost({ post, onChange, initialContent }: Props) {
  function handleChange(content) {
    // @ts-ignore
    onChange({ ...post, content });
  }

  return (
    <>
      {post && (
        <Tiptap
          content={initialContent}
          onChange={(content) => handleChange(content)}
        />
      )}
    </>
  );
}
