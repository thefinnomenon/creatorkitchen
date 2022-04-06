import VisuallyHidden from '@reach/visually-hidden';
import API from '@aws-amplify/api';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import ContentList from '../../components/ContentList';
import debounce from 'debounce';
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
import { Dialog } from '@headlessui/react';
import { Content, Site } from '../../graphql/API';
import { siteByUsernameWithContents } from '../../graphql/customStatements';

const UPDATE_DEBOUNCE = 5000;

let ROOT_DOMAIN = 'localhost:3000';
if (process && process.env.NODE_ENV !== 'development') {
  ROOT_DOMAIN = 'creatorkitchen.net';
}

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function EditPost() {
  const router = useRouter();
  const [site, setSite] = useState<Site>();
  const [domain, setDomain] = useState('');
  const [contents, setContents] = useState<Content[]>([]);
  const [content, setContent] = useState<Content>();
  const [isSaved, setIsSaved] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSubdomainModal, setShowSubdomainModal] = useState(false);
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

  // GET USER DOMAIN
  async function fetchDomain() {
    const { username } = await Auth.currentAuthenticatedUser();
    const siteData = await API.graphql({
      query: siteByUsernameWithContents,
      variables: { username },
    });

    // @ts-ignore
    if (siteData.data.siteByUsername.items.length === 0) {
      setShowSubdomainModal(true);
    } else {
      // @ts-ignore
      console.log(siteData.data.siteByUsername.items[0]);
      // @ts-ignore
      setSite(siteData.data.siteByUsername.items[0]);
      // @ts-ignore
      SiteIdRef.current = siteData.data.siteByUsername.items[0].id;
      // @ts-ignore
      setContents(siteData.data.siteByUsername.items[0].contents.items);
      // @ts-ignore
      setDomain(siteData.data.siteByUsername.items[0].domain);
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

  const isCustomDomain = domain && domain.includes('.');
  const urlRoot = `http://${
    isCustomDomain ? domain : `${domain}.${ROOT_DOMAIN}`
  }`;

  return (
    <>
      <Dialog
        open={showSubdomainModal}
        onClose={() => {}}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded max-w-sm mx-auto">
            <Dialog.Title className="text-center text-2xl">
              Set Subdomain
            </Dialog.Title>
            <Dialog.Description>
              <div className="pb-6 md:pb-0 flex flex-col">
                <div>
                  <label className="input-field inline-flex items-baseline border-none bg-white p-4">
                    <input
                      id="subdomainInput"
                      type="text"
                      className="placeholder-blue w-full p-1 no-outline text-dusty-blue-darker"
                      name="subdomain"
                      placeholder="mscott"
                    />
                    <span className="flex-none text-dusty-blue-darker select-none leading-none">
                      .creatorkitchen.net
                    </span>
                  </label>
                </div>
              </div>
            </Dialog.Description>
            <div className="flex justify-around">
              <button
                className="bg-blue-600 text-white font-semibold px-8 w-1/2 rounded-lg h-8 my-2 hover:bg-blue-500"
                onClick={async () => {
                  // @ts-ignore
                  const sd = document.querySelector('#subdomainInput').value;
                  if (sd === '') {
                    // @ts-ignore
                    document.querySelector('#subdomainInput').value = '';
                    return;
                  }
                  try {
                    console.log('Creating site for user, ', sd);
                    const createSiteResult = await API.graphql({
                      query: createSite,
                      variables: {
                        input: {
                          domain: sd,
                        },
                      },
                      authMode: 'AMAZON_COGNITO_USER_POOLS',
                    });
                    console.log(createSiteResult);
                    // @ts-ignore
                    setSite(createSiteResult.data.createSite);
                    setDomain(sd);
                    setShowSubdomainModal(false);
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                Set
              </button>
              <button
                disabled={!domain}
                className="disabled:text-gray-400 w-1/4 font-semibold rounded-lg h-8 my-2"
                onClick={() => setShowSubdomainModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      <div className="w-full overflow-hidden h-screen bg-white flex justify-between">
        <div className="w-52">
          <ContentList
            contents={contents}
            selectedId={content ? content.id : ''}
            onCreate={onCreate}
            onSelect={onSelect}
            onSignOut={onSignOut}
          />
        </div>
        <div className="md:mt-4 flex-1 items-stretch max-w-4xl">
          {content && (
            <div className="flex items-center justify-between px-4 pb-2">
              {isSaved ? <p className="text-gray-400">Saved</p> : <div />}
              <div className="flex items-stretch">
                <a
                  className="text-blue-600 font-semibold rounded-lg p-2 hover:bg-gray-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${urlRoot}/preview/${content.id}`}
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
                    if (process.env.NODE_ENV === 'development') {
                      console.log(
                        "Revalidation doesn't work in dev mode so just simulating a publish"
                      );
                      setTimeout(() => setIsPublishing(false), 2000);
                    } else {
                      console.log(
                        `${urlRoot}/api/publish?slug=${content.id}&secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}`
                      );
                      const response = await fetch(
                        `${urlRoot}/api/publish?slug=${content.id}&secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}`
                      );
                      setIsPublishing(false);
                    }
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
                  href={`${urlRoot}/posts/${content.id}`}
                >
                  <button
                  //disabled={disabled}
                  >
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
              post={content}
              onUpdate={(values) => onUpdate(values)}
              setIsSaved={setIsSaved}
              onDelete={onDelete}
            />
          </div>
        )}
      </div>
    </>
  );
}
