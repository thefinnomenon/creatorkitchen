import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import Tiptap from '../components/TipTap';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const id = uuidv4();
    router.push(`posts/edit/${id}`);
  });

  return (
    <div className="text-3xl">
      You should be redirected to a new post editor momentarily
    </div>
  );
}
