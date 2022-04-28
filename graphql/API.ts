/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSiteFilterInput = {
  id?: ModelIDInput | null,
  subdomain?: ModelStringInput | null,
  customDomain?: ModelStringInput | null,
  username?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelSiteFilterInput | null > | null,
  or?: Array< ModelSiteFilterInput | null > | null,
  not?: ModelSiteFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelSiteConnection = {
  __typename: "ModelSiteConnection",
  items:  Array<Site | null >,
  nextToken?: string | null,
};

export type Site = {
  __typename: "Site",
  id: string,
  subdomain?: string | null,
  customDomain?: string | null,
  username?: string | null,
  title: string,
  description: string,
  contents?: ModelContentConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelContentConnection = {
  __typename: "ModelContentConnection",
  items:  Array<Content | null >,
  nextToken?: string | null,
};

export type Content = {
  __typename: "Content",
  id: string,
  siteID: string,
  parentID: string,
  slug: string,
  published?: ModelContentConnection | null,
  author: Author,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  media?: string | null,
  status?: ContentStatus | null,
  originalCreatedAt?: string | null,
  createdAt: string,
  updatedAt: string,
  contentAuthorId: string,
};

export type Author = {
  __typename: "Author",
  id: string,
  avatarUrl: string,
  name: string,
  bio: string,
  links?: string | null,
  createdAt: string,
  updatedAt: string,
  username?: string | null,
};

export enum ContentStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}


export type ModelIDKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelContentFilterInput = {
  id?: ModelIDInput | null,
  siteID?: ModelIDInput | null,
  parentID?: ModelIDInput | null,
  slug?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  content?: ModelStringInput | null,
  media?: ModelStringInput | null,
  status?: ModelContentStatusInput | null,
  originalCreatedAt?: ModelStringInput | null,
  and?: Array< ModelContentFilterInput | null > | null,
  or?: Array< ModelContentFilterInput | null > | null,
  not?: ModelContentFilterInput | null,
  contentAuthorId?: ModelIDInput | null,
};

export type ModelContentStatusInput = {
  eq?: ContentStatus | null,
  ne?: ContentStatus | null,
};

export type CreateContentInput = {
  id?: string | null,
  siteID: string,
  parentID: string,
  slug: string,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  media?: string | null,
  status?: ContentStatus | null,
  originalCreatedAt?: string | null,
  contentAuthorId: string,
};

export type ModelContentConditionInput = {
  parentID?: ModelIDInput | null,
  slug?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  content?: ModelStringInput | null,
  media?: ModelStringInput | null,
  status?: ModelContentStatusInput | null,
  originalCreatedAt?: ModelStringInput | null,
  and?: Array< ModelContentConditionInput | null > | null,
  or?: Array< ModelContentConditionInput | null > | null,
  not?: ModelContentConditionInput | null,
  contentAuthorId?: ModelIDInput | null,
};

export type UpdateContentInput = {
  id: string,
  siteID: string,
  parentID?: string | null,
  slug?: string | null,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  media?: string | null,
  status?: ContentStatus | null,
  originalCreatedAt?: string | null,
  contentAuthorId?: string | null,
};

export type DeleteContentInput = {
  id: string,
  siteID: string,
};

export type CreateAuthorInput = {
  id?: string | null,
  avatarUrl: string,
  name: string,
  bio: string,
  links?: string | null,
};

export type ModelAuthorConditionInput = {
  avatarUrl?: ModelStringInput | null,
  name?: ModelStringInput | null,
  bio?: ModelStringInput | null,
  links?: ModelStringInput | null,
  and?: Array< ModelAuthorConditionInput | null > | null,
  or?: Array< ModelAuthorConditionInput | null > | null,
  not?: ModelAuthorConditionInput | null,
};

export type UpdateAuthorInput = {
  id: string,
  avatarUrl?: string | null,
  name?: string | null,
  bio?: string | null,
  links?: string | null,
};

export type DeleteAuthorInput = {
  id: string,
};

export type CreateSiteInput = {
  id?: string | null,
  subdomain?: string | null,
  customDomain?: string | null,
  username?: string | null,
  title: string,
  description: string,
};

export type ModelSiteConditionInput = {
  subdomain?: ModelStringInput | null,
  customDomain?: ModelStringInput | null,
  username?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelSiteConditionInput | null > | null,
  or?: Array< ModelSiteConditionInput | null > | null,
  not?: ModelSiteConditionInput | null,
};

export type UpdateSiteInput = {
  id: string,
  subdomain?: string | null,
  customDomain?: string | null,
  username?: string | null,
  title?: string | null,
  description?: string | null,
};

export type DeleteSiteInput = {
  id: string,
};

export type ModelAuthorFilterInput = {
  id?: ModelIDInput | null,
  avatarUrl?: ModelStringInput | null,
  name?: ModelStringInput | null,
  bio?: ModelStringInput | null,
  links?: ModelStringInput | null,
  and?: Array< ModelAuthorFilterInput | null > | null,
  or?: Array< ModelAuthorFilterInput | null > | null,
  not?: ModelAuthorFilterInput | null,
};

export type ModelAuthorConnection = {
  __typename: "ModelAuthorConnection",
  items:  Array<Author | null >,
  nextToken?: string | null,
};

export type SiteByUsernameWithContentsQueryVariables = {
  username: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSiteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SiteByUsernameWithContentsQuery = {
  siteByUsername?:  {
    __typename: "ModelSiteConnection",
    items:  Array< {
      __typename: "Site",
      id: string,
      subdomain?: string | null,
      customDomain?: string | null,
      username?: string | null,
      title: string,
      description: string,
      contents?:  {
        __typename: "ModelContentConnection",
        nextToken?: string | null,
        items:  Array< {
          __typename: "Content",
          author:  {
            __typename: "Author",
            id: string,
            avatarUrl: string,
            name: string,
            bio: string,
            links?: string | null,
          },
          id: string,
          content?: string | null,
          title?: string | null,
          siteID: string,
          slug: string,
          updatedAt: string,
          createdAt: string,
          description?: string | null,
          status?: ContentStatus | null,
          published?:  {
            __typename: "ModelContentConnection",
            items:  Array< {
              __typename: "Content",
              id: string,
              siteID: string,
              slug: string,
              createdAt: string,
              updatedAt: string,
              status?: ContentStatus | null,
            } | null >,
            nextToken?: string | null,
          } | null,
        } | null >,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListSitesWithContentsQueryVariables = {
  filter?: ModelSiteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSitesWithContentsQuery = {
  listSites?:  {
    __typename: "ModelSiteConnection",
    items:  Array< {
      __typename: "Site",
      id: string,
      subdomain?: string | null,
      customDomain?: string | null,
      username?: string | null,
      contents?:  {
        __typename: "ModelContentConnection",
        nextToken?: string | null,
        items:  Array< {
          __typename: "Content",
          author:  {
            __typename: "Author",
            id: string,
            avatarUrl: string,
            name: string,
            bio: string,
            links?: string | null,
          },
          id: string,
          content?: string | null,
          title?: string | null,
          siteID: string,
          slug: string,
          updatedAt: string,
          createdAt: string,
          description?: string | null,
          status?: ContentStatus | null,
          published?:  {
            __typename: "ModelContentConnection",
            nextToken?: string | null,
            items:  Array< {
              __typename: "Content",
              id: string,
              siteID: string,
              slug: string,
              author:  {
                __typename: "Author",
                id: string,
                avatarUrl: string,
                name: string,
                bio: string,
                links?: string | null,
              },
              title?: string | null,
              description?: string | null,
              content?: string | null,
              media?: string | null,
              status?: ContentStatus | null,
              createdAt: string,
              updatedAt: string,
            } | null >,
          } | null,
        } | null >,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ContentAndPublishedBySiteAndSlugQueryVariables = {
  slug: string,
  siteID?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelContentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ContentAndPublishedBySiteAndSlugQuery = {
  contentBySiteAndSlug?:  {
    __typename: "ModelContentConnection",
    items:  Array< {
      __typename: "Content",
      id: string,
      siteID: string,
      slug: string,
      published?:  {
        __typename: "ModelContentConnection",
        nextToken?: string | null,
        items:  Array< {
          __typename: "Content",
          id: string,
          siteID: string,
          slug: string,
          author:  {
            __typename: "Author",
            id: string,
            avatarUrl: string,
            name: string,
            bio: string,
            links?: string | null,
          },
          title?: string | null,
          description?: string | null,
          content?: string | null,
          media?: string | null,
          status?: ContentStatus | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
      } | null,
      author:  {
        __typename: "Author",
        id: string,
        avatarUrl: string,
        name: string,
        bio: string,
        links?: string | null,
      },
      title?: string | null,
      description?: string | null,
      content?: string | null,
      media?: string | null,
      status?: ContentStatus | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateContentMutationVariables = {
  input: CreateContentInput,
  condition?: ModelContentConditionInput | null,
};

export type CreateContentMutation = {
  createContent?:  {
    __typename: "Content",
    id: string,
    siteID: string,
    parentID: string,
    slug: string,
    published?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    author:  {
      __typename: "Author",
      id: string,
      avatarUrl: string,
      name: string,
      bio: string,
      links?: string | null,
      createdAt: string,
      updatedAt: string,
      username?: string | null,
    },
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    status?: ContentStatus | null,
    originalCreatedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    contentAuthorId: string,
  } | null,
};

export type UpdateContentMutationVariables = {
  input: UpdateContentInput,
  condition?: ModelContentConditionInput | null,
};

export type UpdateContentMutation = {
  updateContent?:  {
    __typename: "Content",
    id: string,
    siteID: string,
    parentID: string,
    slug: string,
    published?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    author:  {
      __typename: "Author",
      id: string,
      avatarUrl: string,
      name: string,
      bio: string,
      links?: string | null,
      createdAt: string,
      updatedAt: string,
      username?: string | null,
    },
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    status?: ContentStatus | null,
    originalCreatedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    contentAuthorId: string,
  } | null,
};

export type DeleteContentMutationVariables = {
  input: DeleteContentInput,
  condition?: ModelContentConditionInput | null,
};

export type DeleteContentMutation = {
  deleteContent?:  {
    __typename: "Content",
    id: string,
    siteID: string,
    parentID: string,
    slug: string,
    published?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    author:  {
      __typename: "Author",
      id: string,
      avatarUrl: string,
      name: string,
      bio: string,
      links?: string | null,
      createdAt: string,
      updatedAt: string,
      username?: string | null,
    },
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    status?: ContentStatus | null,
    originalCreatedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    contentAuthorId: string,
  } | null,
};

export type CreateAuthorMutationVariables = {
  input: CreateAuthorInput,
  condition?: ModelAuthorConditionInput | null,
};

export type CreateAuthorMutation = {
  createAuthor?:  {
    __typename: "Author",
    id: string,
    avatarUrl: string,
    name: string,
    bio: string,
    links?: string | null,
    createdAt: string,
    updatedAt: string,
    username?: string | null,
  } | null,
};

export type UpdateAuthorMutationVariables = {
  input: UpdateAuthorInput,
  condition?: ModelAuthorConditionInput | null,
};

export type UpdateAuthorMutation = {
  updateAuthor?:  {
    __typename: "Author",
    id: string,
    avatarUrl: string,
    name: string,
    bio: string,
    links?: string | null,
    createdAt: string,
    updatedAt: string,
    username?: string | null,
  } | null,
};

export type DeleteAuthorMutationVariables = {
  input: DeleteAuthorInput,
  condition?: ModelAuthorConditionInput | null,
};

export type DeleteAuthorMutation = {
  deleteAuthor?:  {
    __typename: "Author",
    id: string,
    avatarUrl: string,
    name: string,
    bio: string,
    links?: string | null,
    createdAt: string,
    updatedAt: string,
    username?: string | null,
  } | null,
};

export type CreateSiteMutationVariables = {
  input: CreateSiteInput,
  condition?: ModelSiteConditionInput | null,
};

export type CreateSiteMutation = {
  createSite?:  {
    __typename: "Site",
    id: string,
    subdomain?: string | null,
    customDomain?: string | null,
    username?: string | null,
    title: string,
    description: string,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateSiteMutationVariables = {
  input: UpdateSiteInput,
  condition?: ModelSiteConditionInput | null,
};

export type UpdateSiteMutation = {
  updateSite?:  {
    __typename: "Site",
    id: string,
    subdomain?: string | null,
    customDomain?: string | null,
    username?: string | null,
    title: string,
    description: string,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteSiteMutationVariables = {
  input: DeleteSiteInput,
  condition?: ModelSiteConditionInput | null,
};

export type DeleteSiteMutation = {
  deleteSite?:  {
    __typename: "Site",
    id: string,
    subdomain?: string | null,
    customDomain?: string | null,
    username?: string | null,
    title: string,
    description: string,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetContentQueryVariables = {
  id: string,
  siteID: string,
};

export type GetContentQuery = {
  getContent?:  {
    __typename: "Content",
    id: string,
    siteID: string,
    parentID: string,
    slug: string,
    published?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    author:  {
      __typename: "Author",
      id: string,
      avatarUrl: string,
      name: string,
      bio: string,
      links?: string | null,
      createdAt: string,
      updatedAt: string,
      username?: string | null,
    },
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    status?: ContentStatus | null,
    originalCreatedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    contentAuthorId: string,
  } | null,
};

export type ListContentsQueryVariables = {
  id?: string | null,
  siteID?: ModelIDKeyConditionInput | null,
  filter?: ModelContentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListContentsQuery = {
  listContents?:  {
    __typename: "ModelContentConnection",
    items:  Array< {
      __typename: "Content",
      id: string,
      siteID: string,
      parentID: string,
      slug: string,
      published?:  {
        __typename: "ModelContentConnection",
        nextToken?: string | null,
      } | null,
      author:  {
        __typename: "Author",
        id: string,
        avatarUrl: string,
        name: string,
        bio: string,
        links?: string | null,
        createdAt: string,
        updatedAt: string,
        username?: string | null,
      },
      title?: string | null,
      description?: string | null,
      content?: string | null,
      media?: string | null,
      status?: ContentStatus | null,
      originalCreatedAt?: string | null,
      createdAt: string,
      updatedAt: string,
      contentAuthorId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ContentByParentIDQueryVariables = {
  parentID: string,
  siteID?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelContentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ContentByParentIDQuery = {
  contentByParentID?:  {
    __typename: "ModelContentConnection",
    items:  Array< {
      __typename: "Content",
      id: string,
      siteID: string,
      parentID: string,
      slug: string,
      published?:  {
        __typename: "ModelContentConnection",
        nextToken?: string | null,
      } | null,
      author:  {
        __typename: "Author",
        id: string,
        avatarUrl: string,
        name: string,
        bio: string,
        links?: string | null,
        createdAt: string,
        updatedAt: string,
        username?: string | null,
      },
      title?: string | null,
      description?: string | null,
      content?: string | null,
      media?: string | null,
      status?: ContentStatus | null,
      originalCreatedAt?: string | null,
      createdAt: string,
      updatedAt: string,
      contentAuthorId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ContentBySiteAndSlugQueryVariables = {
  slug: string,
  siteID?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelContentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ContentBySiteAndSlugQuery = {
  contentBySiteAndSlug?:  {
    __typename: "ModelContentConnection",
    items:  Array< {
      __typename: "Content",
      id: string,
      siteID: string,
      parentID: string,
      slug: string,
      published?:  {
        __typename: "ModelContentConnection",
        nextToken?: string | null,
      } | null,
      author:  {
        __typename: "Author",
        id: string,
        avatarUrl: string,
        name: string,
        bio: string,
        links?: string | null,
        createdAt: string,
        updatedAt: string,
        username?: string | null,
      },
      title?: string | null,
      description?: string | null,
      content?: string | null,
      media?: string | null,
      status?: ContentStatus | null,
      originalCreatedAt?: string | null,
      createdAt: string,
      updatedAt: string,
      contentAuthorId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAuthorQueryVariables = {
  id: string,
};

export type GetAuthorQuery = {
  getAuthor?:  {
    __typename: "Author",
    id: string,
    avatarUrl: string,
    name: string,
    bio: string,
    links?: string | null,
    createdAt: string,
    updatedAt: string,
    username?: string | null,
  } | null,
};

export type ListAuthorsQueryVariables = {
  filter?: ModelAuthorFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAuthorsQuery = {
  listAuthors?:  {
    __typename: "ModelAuthorConnection",
    items:  Array< {
      __typename: "Author",
      id: string,
      avatarUrl: string,
      name: string,
      bio: string,
      links?: string | null,
      createdAt: string,
      updatedAt: string,
      username?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetSiteQueryVariables = {
  id: string,
};

export type GetSiteQuery = {
  getSite?:  {
    __typename: "Site",
    id: string,
    subdomain?: string | null,
    customDomain?: string | null,
    username?: string | null,
    title: string,
    description: string,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListSitesQueryVariables = {
  filter?: ModelSiteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSitesQuery = {
  listSites?:  {
    __typename: "ModelSiteConnection",
    items:  Array< {
      __typename: "Site",
      id: string,
      subdomain?: string | null,
      customDomain?: string | null,
      username?: string | null,
      title: string,
      description: string,
      contents?:  {
        __typename: "ModelContentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SiteBySubdomainQueryVariables = {
  subdomain: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSiteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SiteBySubdomainQuery = {
  siteBySubdomain?:  {
    __typename: "ModelSiteConnection",
    items:  Array< {
      __typename: "Site",
      id: string,
      subdomain?: string | null,
      customDomain?: string | null,
      username?: string | null,
      title: string,
      description: string,
      contents?:  {
        __typename: "ModelContentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SiteByCustomDomainQueryVariables = {
  customDomain: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSiteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SiteByCustomDomainQuery = {
  siteByCustomDomain?:  {
    __typename: "ModelSiteConnection",
    items:  Array< {
      __typename: "Site",
      id: string,
      subdomain?: string | null,
      customDomain?: string | null,
      username?: string | null,
      title: string,
      description: string,
      contents?:  {
        __typename: "ModelContentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SiteByUsernameQueryVariables = {
  username: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSiteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SiteByUsernameQuery = {
  siteByUsername?:  {
    __typename: "ModelSiteConnection",
    items:  Array< {
      __typename: "Site",
      id: string,
      subdomain?: string | null,
      customDomain?: string | null,
      username?: string | null,
      title: string,
      description: string,
      contents?:  {
        __typename: "ModelContentConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateContentSubscriptionVariables = {
  author?: string | null,
};

export type OnCreateContentSubscription = {
  onCreateContent?:  {
    __typename: "Content",
    id: string,
    siteID: string,
    parentID: string,
    slug: string,
    published?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    author:  {
      __typename: "Author",
      id: string,
      avatarUrl: string,
      name: string,
      bio: string,
      links?: string | null,
      createdAt: string,
      updatedAt: string,
      username?: string | null,
    },
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    status?: ContentStatus | null,
    originalCreatedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    contentAuthorId: string,
  } | null,
};

export type OnUpdateContentSubscriptionVariables = {
  author?: string | null,
};

export type OnUpdateContentSubscription = {
  onUpdateContent?:  {
    __typename: "Content",
    id: string,
    siteID: string,
    parentID: string,
    slug: string,
    published?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    author:  {
      __typename: "Author",
      id: string,
      avatarUrl: string,
      name: string,
      bio: string,
      links?: string | null,
      createdAt: string,
      updatedAt: string,
      username?: string | null,
    },
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    status?: ContentStatus | null,
    originalCreatedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    contentAuthorId: string,
  } | null,
};

export type OnDeleteContentSubscriptionVariables = {
  author?: string | null,
};

export type OnDeleteContentSubscription = {
  onDeleteContent?:  {
    __typename: "Content",
    id: string,
    siteID: string,
    parentID: string,
    slug: string,
    published?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    author:  {
      __typename: "Author",
      id: string,
      avatarUrl: string,
      name: string,
      bio: string,
      links?: string | null,
      createdAt: string,
      updatedAt: string,
      username?: string | null,
    },
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    status?: ContentStatus | null,
    originalCreatedAt?: string | null,
    createdAt: string,
    updatedAt: string,
    contentAuthorId: string,
  } | null,
};

export type OnCreateAuthorSubscriptionVariables = {
  username?: string | null,
};

export type OnCreateAuthorSubscription = {
  onCreateAuthor?:  {
    __typename: "Author",
    id: string,
    avatarUrl: string,
    name: string,
    bio: string,
    links?: string | null,
    createdAt: string,
    updatedAt: string,
    username?: string | null,
  } | null,
};

export type OnUpdateAuthorSubscriptionVariables = {
  username?: string | null,
};

export type OnUpdateAuthorSubscription = {
  onUpdateAuthor?:  {
    __typename: "Author",
    id: string,
    avatarUrl: string,
    name: string,
    bio: string,
    links?: string | null,
    createdAt: string,
    updatedAt: string,
    username?: string | null,
  } | null,
};

export type OnDeleteAuthorSubscriptionVariables = {
  username?: string | null,
};

export type OnDeleteAuthorSubscription = {
  onDeleteAuthor?:  {
    __typename: "Author",
    id: string,
    avatarUrl: string,
    name: string,
    bio: string,
    links?: string | null,
    createdAt: string,
    updatedAt: string,
    username?: string | null,
  } | null,
};

export type OnCreateSiteSubscriptionVariables = {
  username?: string | null,
};

export type OnCreateSiteSubscription = {
  onCreateSite?:  {
    __typename: "Site",
    id: string,
    subdomain?: string | null,
    customDomain?: string | null,
    username?: string | null,
    title: string,
    description: string,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateSiteSubscriptionVariables = {
  username?: string | null,
};

export type OnUpdateSiteSubscription = {
  onUpdateSite?:  {
    __typename: "Site",
    id: string,
    subdomain?: string | null,
    customDomain?: string | null,
    username?: string | null,
    title: string,
    description: string,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteSiteSubscriptionVariables = {
  username?: string | null,
};

export type OnDeleteSiteSubscription = {
  onDeleteSite?:  {
    __typename: "Site",
    id: string,
    subdomain?: string | null,
    customDomain?: string | null,
    username?: string | null,
    title: string,
    description: string,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        parentID: string,
        slug: string,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        status?: ContentStatus | null,
        originalCreatedAt?: string | null,
        createdAt: string,
        updatedAt: string,
        contentAuthorId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
