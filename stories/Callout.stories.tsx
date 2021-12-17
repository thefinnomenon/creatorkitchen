import Tiptap from '../components/TipTap';

export default {
  title: 'Pages/Elements/Callout',
  component: Tiptap,
  argTypes: {
    content: {
      control: { type: 'text' },
    },
    preview: {
      control: { type: 'boolean' },
    },
  },
};

export const Callout = () => (
  <Tiptap
    content="<callout></callout>"
    preview
    onChange={(value) => console.log(value)}
  />
);
