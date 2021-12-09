import Tiptap from '../components/TipTap';

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-200 flex justify-center items-stretch">
      <div className="md:mt-4 flex-1 max-w-4xl min-w-0 bg-white shadow-xl flex justify-center">
        <Tiptap />
      </div>
    </div>
  );
}
