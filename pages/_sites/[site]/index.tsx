import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Index(props) {
  const router = useRouter();
  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <p>{props.name}</p>

      <li>
        <Link href="https://subdomain-1.vercel.sh">subdomain-1.vercel.sh</Link>
      </li>
      <li>
        <Link href="https://subdomain-2.vercel.sh">subdomain-2.vercel.sh</Link>
      </li>
      <li>
        <Link href="https://subdomain-3.vercel.sh">subdomain-3.vercel.sh</Link>
      </li>
      <li>
        <Link href="https://custom-domain-1.com">custom-domain-1.com</Link>{' '}
        (maps to{' '}
        <Link href="https://subdomain-1.vercel.sh">subdomain-1.vercel.sh</Link>)
      </li>
    </>
  );
}

const mockDB = [
  {
    name: 'Site 1',
    description: 'Subdomain + custom domain',
    subdomain: 'subdomain-1',
    customDomain: 'custom-domain-1.com',
  },
  {
    name: 'Site 2',
    description: 'Subdomain only',
    subdomain: 'subdomain-2',
    customDomain: null,
  },
  {
    name: 'Site 3',
    description: 'Subdomain only',
    subdomain: 'subdomain-3',
    customDomain: null,
  },
];

export async function getStaticPaths() {
  // get all sites that have subdomains set up
  const subdomains = mockDB.filter((item) => item.subdomain);

  // get all sites that have custom domains set up
  const customDomains = mockDB.filter((item) => item.customDomain);

  // build paths for each of the sites in the previous two lists
  const paths = [
    ...subdomains.map((item) => {
      return { params: { site: item.subdomain } };
    }),
    ...customDomains.map((item) => {
      return { params: { site: item.customDomain } };
    }),
  ];
  return {
    paths: paths,
    fallback: true, // fallback true allows sites to be generated using ISR
  };
}

export async function getStaticProps({ params: { site } }) {
  // check if site is a custom domain or a subdomain
  const customDomain = site.includes('.') ? true : false;

  // fetch data from mock database using the site value as the key
  const data = mockDB.filter((item) =>
    customDomain ? item.customDomain == site : item.subdomain == site
  );

  return {
    props: { ...data[0] },
    revalidate: 3600, // set revalidate interval of 1h
  };
}
