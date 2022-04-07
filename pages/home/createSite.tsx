import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Link from 'next/link';

import ConfigureDomain from '../../components/ConfigureDomain';

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-rose-100 to-teal-100">
      <ConfigureDomain />
    </div>
  );
}
