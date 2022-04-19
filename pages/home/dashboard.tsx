import API from '@aws-amplify/api';
import { useRouter } from 'next/router';
import { useDebounce } from 'use-debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import ContentList from '../../components/ContentList';
import { v4 as uuidv4 } from 'uuid';
import { createContent, createSite, deleteContent, updateContent } from '../../graphql/mutations';
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
import ContentToolbar from '../../components/ContentToolbar';
import SiteSettingsPanel from '../../components/SiteSettingsPanel';

const UPDATE_DEBOUNCE = 2000;
const PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL;
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export const getSiteUrl = (site: Pick<Site, 'customDomain' | 'subdomain'>) =>
  `${PROTOCOL}${site.customDomain ? site.customDomain : `${site.subdomain}.${ROOT_DOMAIN}`}`;

export interface Site extends Omit<SiteBasic, 'contents'> {
  url: string;
  contents: Content[];
}

type Props = {} & typeof defaultProps;

const defaultProps = Object.freeze({});
const initialState = Object.freeze({});

export default function EditPost() {
  const router = useRouter();
  const [site, setSite] = useState<Site>();
  const [currIndex, setCurrIndex] = useState(null);
  const [initialContent, setInitialContent] = useState('');
  const [content, setContent] = useState('');
  const [debouncedContent] = useDebounce(content, UPDATE_DEBOUNCE);
  const [isSaved, setIsSaved] = useState(true);
  const IdRef = useRef('');

  // Checks if current content autosaved before changing
  // NOTE: This is super important because without checking if there
  // is an autosave pending before changing the selected content, you
  // will introduce a subtle bug where the autosave executes on the new
  // selected content instead of the intended one
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
    if (!checkIfSaved()) return;

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

    setSite({ ...site, contents: [data.createContent, ...site.contents] });
    setCurrIndex('0');
    IdRef.current = data.createContent.id;
  }

  // When debouncedContent updates, autosave
  useEffect(() => {
    if (debouncedContent) {
      onAutoSaveEditorContents(debouncedContent);
    }
  }, [debouncedContent]);

  // HACK: This isn't ideal but a change in TipTap causes a change in the site contents which
  // then causes a change in TipTap's intialValue which then causes it to set the editor to
  // the new contents. This would be fine but the parsing always messes up spacing and I haven't
  // been able to figure out why. So... the hack for now is to only update the initial value when
  // we change between content.
  useEffect(() => {
    if (IdRef.current) {
      const index = site.contents.findIndex((c) => c.id === IdRef.current);
      setInitialContent(site.contents[index].content);
    }
  }, [IdRef.current]);

  // UPDATE CONTENT FROM EDITOR
  async function onAutoSaveEditorContents(editorContent) {
    // The autosave was cleared so do nothing
    if (isSaved) return;

    (await API.graphql({
      query: updateContent,
      variables: {
        input: {
          id: site.contents[currIndex].id,
          siteID: site.id,
          content: editorContent,
        },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as { data: UpdateContentMutation; errors: any[] };

    setSite({
      ...site,
      contents: Object.assign([], site.contents, {
        [currIndex]: { ...site.contents[currIndex], content: editorContent },
      }),
    });

    setIsSaved(true);
  }

  // LOAD USER SITE ON LOAD
  useEffect(() => {
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

      // Sort content alphabetically by title (this has the added bonus of floating untitled ('') to the top)
      site.contents.items.sort((a, b) => (a.title > b.title ? 1 : -1));

      // @ts-ignore: I am using my extended type and will handle the differences
      const s: Site = site;

      // Add URL to site
      s.url = getSiteUrl(site);

      // Simplify the contents path
      s.contents = site.contents.items;

      setSite(s);
    }
    fetchSite();
  }, [router, setSite]);

  // DELETE CONTENT
  async function onDelete(siteID, id) {
    setIsSaved(true);

    (await API.graphql({
      query: deleteContent,
      variables: { input: { id, siteID } },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })) as { data: DeleteContentMutation; errors: any[] };

    setCurrIndex(null);
    IdRef.current = null;
    setSite({ ...site, contents: site.contents.filter((c) => c.id !== id) });
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

  // HACK: For now I am determining if on site page by setting
  // currIndex to 'site'. In the end I want a filesystem-esque viewer
  // and will handle this there
  const isContent = currIndex !== null && currIndex !== 'site';

  return (
    <div className="h-screen flex justify-between overflow-y-hidden">
      <ContentList
        site={site}
        IdRef={IdRef}
        onCreate={onCreate}
        currIndex={currIndex}
        setCurrIndex={setCurrIndex}
        checkIfSaved={checkIfSaved}
        onSignOut={onSignOut}
      />
      <div className="flex-1 max-w-3xl overflow-y-hidden">
        {isContent && (
          <>
            <ContentToolbar isSaved={isSaved} url={site.url} slug={site.contents[currIndex].slug} />
            <div>
              <Tiptap
                initialContent={initialContent}
                onChange={(content) => {
                  setIsSaved(false);
                  setContent(content);
                }}
              />
            </div>
          </>
        )}
      </div>
      {isContent && (
        <ContentSettingsPanel
          site={site}
          currIndex={currIndex}
          setSite={setSite}
          onDelete={onDelete}
          setCurrIndex={setCurrIndex}
        />
      )}
      {currIndex !== null && !isContent && <SiteSettingsPanel site={site} setSite={setSite} />}
    </div>
  );
}
