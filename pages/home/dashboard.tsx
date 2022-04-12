import VisuallyHidden from '@reach/visually-hidden';
import API from '@aws-amplify/api';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import ContentList from '../../components/ContentList';
import debounce from 'debounce';
import { v4 as uuidv4 } from 'uuid';
import {
  createContent,
  createSite,
  deleteContent,
  updateContent,
} from '../../graphql/mutations';
import { Auth } from 'aws-amplify';
import { getContent } from '../../graphql/queries';
import { signOut } from '../../lib/amplify';
import Tiptap from '../../components/TipTap';
import { FiExternalLink } from 'react-icons/fi';
import ContentSettingsPanel from '../../components/ContentSettingsPanel';
import { ClipLoader } from 'react-spinners';
import { Content, Site } from '../../graphql/API';
import { siteByUsernameWithContents } from '../../graphql/customStatements';
import SiteConfigPage from '../../components/SiteConfigPage';

const UPDATE_DEBOUNCE = 5000;

let PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL;
let ROOT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function EditPost() {
  const router = useRouter();
  const [site, setSite] = useState<Site>();
  const [subdomain, setSubdomain] = useState('');
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [contents, setContents] = useState<Content[]>([]);
  const [content, setContent] = useState<Content>();
  const [isSaved, setIsSaved] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const SiteIdRef = useRef('');
  const IdRef = useRef('');

  // CREATE
  async function onCreate() {
    if (!isSaved) {
      const cont = confirm(
        "Current draft isn't saved. Want to continue and lose changes?"
      );
      if (!cont) return;
      debouncedUpdate.clear();
      setIsSaved(true);
    }

    const res = await API.graphql({
      query: createContent,
      variables: {
        input: {
          title: '',
          description: '',
          content: '',
          slug: uuidv4(),
          siteID: site.id,
        },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });

    // @ts-ignore
    const newContent = res.data.createContent;
    // @ts-ignore
    IdRef.current = res.data.createContent.id;
    setContents([...contents, newContent]);
    setContent(newContent);
  }

  const debouncedUpdate = useCallback(
    debounce((values) => onUpdate(values), UPDATE_DEBOUNCE),
    []
  );

  // UPDATE
  async function onUpdate(values) {
    if (!SiteIdRef.current || !IdRef.current) return;
    const siteID = SiteIdRef.current;
    const id = IdRef.current;

    // If title updated, update it in the content list
    if ('title' in values) {
      const contentIndex = contents.findIndex((c) => c.id === IdRef.current);
      if (contentIndex !== -1) contents[contentIndex].title = values.title;
    }

    if ('slug' in values) {
      setContent({ ...content, slug: values.slug });
    }

    await API.graphql({
      query: updateContent,
      variables: {
        input: {
          id,
          siteID,
          ...values,
        },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });

    setIsSaved(true);
  }

  // DELETE
  async function onDelete(id) {
    debouncedUpdate.clear();
    setIsSaved(true);

    await API.graphql({
      query: deleteContent,
      variables: { input: { id, siteID: SiteIdRef.current } },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });

    const newContents = contents.filter((c) => {
      return c.id !== id;
    });

    IdRef.current = null;
    setContents(newContents);
    setContent(null);
  }

  // LOAD USER DOMAIN ON MOUNT
  useEffect(() => {
    fetchDomain();
  }, []);

  // UPDATE URL
  useEffect(() => {
    // If using a custom domain in development mode, it should be mapped to localhost in env/hosts
    // e.g.   127.0.0.1  example.test
    // To use, it will still need to have the port so we will add it
    if (domain && process.env.NODE_ENV === 'development') {
      setUrl(
        `${PROTOCOL}${
          domain ? `${domain}:3000` : `${subdomain}.${ROOT_DOMAIN}`
        }`
      );
    } else {
      setUrl(`${PROTOCOL}${domain ? domain : `${subdomain}.${ROOT_DOMAIN}`}`);
    }
  }, [domain, subdomain]);

  // GET USER DOMAIN
  async function fetchDomain() {
    const { username } = await Auth.currentAuthenticatedUser();
    const siteData = await API.graphql({
      query: siteByUsernameWithContents,
      variables: { username },
    });

    // @ts-ignore
    if (siteData.data.siteByUsername.items.length === 0) {
      router.push('/');
    } else {
      // @ts-ignore
      const { customDomain } = siteData.data.siteByUsername.items[0];
      // Note: '-1' is the same as no domain, since it is a index I can't set it to null
      if (customDomain === '-1') {
        // @ts-ignore
        siteData.data.siteByUsername.items[0].customDomain = '';
      }
      // @ts-ignore
      console.log(siteData.data.siteByUsername.items[0]);
      // @ts-ignore
      setSite(siteData.data.siteByUsername.items[0]);
      // @ts-ignore
      SiteIdRef.current = siteData.data.siteByUsername.items[0].id;
      // @ts-ignore
      setContents(siteData.data.siteByUsername.items[0].contents.items);
      // @ts-ignore
      setDomain(siteData.data.siteByUsername.items[0].customDomain);
      // @ts-ignore
      setSubdomain(siteData.data.siteByUsername.items[0].subdomain);
    }
  }

  // GET SELECTED POST
  async function onSelect(id) {
    try {
      if (!isSaved) {
        const cont = confirm(
          "Current draft isn't saved. Want to continue and lose changes?"
        );
        if (!cont) return;
        debouncedUpdate.clear();
        setIsSaved(true);
      }

      // Selected site
      if (id === 'site') {
        IdRef.current = 'site';
        setContent(null);
        return;
      }

      const contentData = await API.graphql({
        query: getContent,
        variables: { id, siteID: SiteIdRef.current },
      });

      // @ts-ignore
      const newContent = contentData.data.getContent;
      IdRef.current = newContent.id;
      setContent(newContent);
    } catch (error) {
      console.log(error);
    }
  }

  // SIGNOUT
  async function onSignOut() {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.log('Failed to signout');
    }
  }

  return (
    <div className="w-full overflow-hidden h-screen bg-white flex justify-between">
      <div className="w-52">
        {subdomain && (
          <ContentList
            url={url}
            contents={contents}
            selectedId={content ? content.id : ''}
            onCreate={onCreate}
            onSelect={onSelect}
            onSignOut={onSignOut}
          />
        )}
      </div>
      <div className="md:mt-4 flex-1 items-stretch max-w-4xl">
        {IdRef.current === 'site' && <SiteConfigPage url={url} site={site} />}
        {content && (
          <div className="flex items-center justify-between px-4 pb-2">
            {isSaved ? <p className="text-gray-400">Saved</p> : <div />}
            <div className="flex items-stretch">
              <a
                className="text-blue-600 font-semibold rounded-lg p-2 hover:bg-gray-200"
                target="_blank"
                rel="noopener noreferrer"
                href={`${url}/preview/${content.slug}`}
                onClick={(e) => {
                  if (!isSaved) {
                    const cont = alert(
                      "Current draft isn't saved. Please wait a few seconds."
                    );
                    e.preventDefault();
                    return false;
                  }
                }}
              >
                Preview
              </a>

              <button
                className="bg-blue-600 font-semibold text-white rounded-lg p-2 hover:bg-blue-500 mx-2"
                onClick={async (e) => {
                  if (!isSaved) {
                    const cont = alert(
                      "Current draft isn't saved. Please wait a few seconds."
                    );
                    return false;
                  }
                  setIsPublishing(true);
                  try {
                    const cookies = document.cookie;
                    const response = await fetch(
                      `${url}/api/publish?slug=${content.slug}`,
                      {
                        method: 'POST',
                        mode: 'no-cors',
                        body: JSON.stringify(cookies),
                      }
                    );
                  } catch (e) {
                    console.error(e);
                  }
                  setIsPublishing(false);
                }}
              >
                {isPublishing ? (
                  <ClipLoader color="white" size={24} />
                ) : (
                  'Publish'
                )}
              </button>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${url}/posts/${content.slug}`}
              >
                <button>
                  <VisuallyHidden>View published content</VisuallyHidden>
                  <FiExternalLink className="font-semibold text-4xl text-blue-600 rounded-lg p-2 hover:bg-gray-200" />
                </button>
              </a>
            </div>
          </div>
        )}
        {content && (
          <div className="overflow-auto">
            <Tiptap
              content={content.content}
              onChange={(content) => {
                setIsSaved(false);
                debouncedUpdate({ content });
              }}
            />
          </div>
        )}
      </div>
      {content && (
        <div className="w-52">
          <ContentSettingsPanel
            siteID={site.id}
            url={url}
            post={content}
            onUpdate={(values) => onUpdate(values)}
            setIsSaved={setIsSaved}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
}
