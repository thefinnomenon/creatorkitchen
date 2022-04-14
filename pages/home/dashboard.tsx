import API from '@aws-amplify/api';
import { useRouter } from 'next/router';
import { useDebounce } from 'use-debounce';
import { useEffect, useRef, useState } from 'react';
import { useUndoState } from 'rooks';
import ContentList from '../../components/ContentList';
import { v4 as uuidv4 } from 'uuid';
import { createContent, deleteContent, updateContent } from '../../graphql/mutations';
import { Auth } from 'aws-amplify';
import { signOut } from '../../lib/amplify';
import Tiptap from '../../components/TipTap';
import ContentSettingsPanel from '../../components/ContentSettingsPanel';
import { ClipLoader } from 'react-spinners';
import {
  Content,
  Site as SiteBasic,
  CreateContentMutation,
  DeleteContentMutation,
  SiteByUsernameWithContentsQuery,
  UpdateContentMutation,
} from '../../graphql/API';
import { siteByUsernameWithContents } from '../../graphql/customStatements';
import SiteConfigPage from '../../components/SiteConfigPage';
import ContentToolbar from '../../components/ContentToolbar';
import SiteSettingsPanel from '../../components/SiteSettingsPanel';

const UPDATE_DEBOUNCE = 5000;
const PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL;
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export interface Site extends Omit<SiteBasic, 'contents'> {
  url: string;
  contents: Content[];
}

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function EditPost() {
  const router = useRouter();
  const [site, setSite, undoSetSite] = useUndoState(null, { maxSize: 2 }) as [
    Site,
    (previousState: Site) => Site,
    () => void
  ];
  const [content, setContent] = useState<Content>();
  const [debouncedContent] = useDebounce(content, UPDATE_DEBOUNCE);
  const [isSaved, setIsSaved] = useState(true);
  const SiteIdRef = useRef('');
  const IdRef = useRef('');

  // Checks if current content autosaved before changing
  const checkIfSaved = (wait = true) => {
    if (!isSaved) {
      if (wait) {
        const cont = confirm("Current draft isn't saved. Want to continue and lose changes?");
        if (!cont) return false;
      }
      setIsSaved(true);
    }
    return true;
  };

  // CREATE NEW CONTENT
  async function onCreate() {
    //if (checkIfSaved()) return;

    const { data } = (await API.graphql({
      query: createContent,
      variables: {
        input: {
          slug: uuidv4(),
          siteID: site.id,
        },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as { data: CreateContentMutation; errors: any[] };

    //IdRef.current = data.createContent.id;
    setSite({ ...site, contents: [data.createContent, ...site.contents] });
    setContent(data.createContent);
  }

  useEffect(() => {
    //setIsSaved(false);
    //onUpdateContent(debouncedContent);
  }, [debouncedContent]);

  // UPDATE CONTENT FROM EDITOR
  async function onUpdateContent(values) {
    if (!SiteIdRef.current || !IdRef.current) return;
    const siteID = SiteIdRef.current;
    const id = IdRef.current;

    (await API.graphql({
      query: updateContent,
      variables: {
        input: {
          id,
          siteID,
          ...values,
        },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as { data: UpdateContentMutation; errors: any[] };

    setIsSaved(true);
  }

  // LOAD USER SITE ON LOAD
  useEffect(() => {
    fetchSite();
  }, []);

  // GET USER DOMAIN
  async function fetchSite() {
    const { username } = await Auth.currentAuthenticatedUser();
    const { data } = (await API.graphql({
      query: siteByUsernameWithContents,
      variables: { username },
    })) as { data: SiteByUsernameWithContentsQuery; errors: any[] };
    const site = data.siteByUsername.items[0];

    if (!site) {
      router.push('/');
      return;
    }

    // HACK: '-1' is the same as no domain, since it is a index I can't set it to null
    site.customDomain = site.customDomain === '-1' ? '' : site.customDomain;

    // Sort content by most recently updated
    site.contents.items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

    // @ts-ignore: I am using my extended type and will handle the differences
    const s: Site = site;

    // Add URL to site
    s.url = `${PROTOCOL}${site.customDomain ? site.customDomain : `${site.subdomain}.${ROOT_DOMAIN}`}`;

    // Simplify the contents path
    s.contents = site.contents.items;

    setSite(s);
    SiteIdRef.current = s.id;
  }

  // GET SELECTED CONTENT
  async function onSelect(id) {
    try {
      //if (!checkIfSaved()) return;

      // Selected site
      if (id === 'site') {
        IdRef.current = 'site';
        setContent(null);
        return;
      }

      const index = site.contents.findIndex((c) => c.id === id);
      if (index === -1) throw Error(`Failed to find ${id} in site contents`);

      //IdRef.current = id;
      console.log(site.contents[index]);
      setContent(site.contents[index]);
    } catch (error) {
      console.log(error);
    }
  }

  // DELETE CONTENT
  async function onDelete(siteID, id) {
    setIsSaved(true);

    console.log(siteID, id);

    (await API.graphql({
      query: deleteContent,
      variables: { input: { id, siteID } },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as { data: DeleteContentMutation; errors: any[] };

    setSite({ ...site, contents: site.contents.filter((c) => c.id !== id) });
    setContent(null);
  }

  // SIGNOUT
  async function onSignOut() {
    try {
      if (!checkIfSaved()) return;
      await signOut();
      router.push('/');
    } catch (error) {
      console.log('Failed to signout');
    }
  }

  if (!site)
    return (
      <div className="h-screen flex justify-center items-center">
        <ClipLoader />
      </div>
    );

  return (
    <div className="w-full overflow-hidden h-screen flex">
      <ContentList
        site={site}
        selectedId={content ? content.id : ''} //{IdRef.current ? IdRef.current : ''}
        onCreate={onCreate}
        onSelect={onSelect}
        onSignOut={onSignOut}
      />
      <div className="md:mt-4 flex-1 items-stretch max-w-4xl">
        {IdRef.current === 'site' && <SiteConfigPage site={site} setSite={() => {}} />}
        {content && (
          <>
            <ContentToolbar isSaved={isSaved} url={site.url} slug={content.slug} />
            <div className="overflow-auto">
              <Tiptap
                content={content.content}
                onChange={(content) => {
                  setIsSaved(false);
                  setContent(content);
                }}
              />
            </div>
          </>
        )}
      </div>
      {/* {content && <ContentSettingsPanel site={site} content={content} setSite={setSite} onDelete={onDelete} />} */}
      {site && <SiteSettingsPanel site={site} setSite={setSite} />}
    </div>
  );
}
