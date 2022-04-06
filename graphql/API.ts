/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateContentInput = {
  id?: string | null,
  siteID: string,
  author?: string | null,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  media?: string | null,
};

export type ModelContentConditionInput = {
  author?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  content?: ModelStringInput | null,
  media?: ModelStringInput | null,
  and?: Array< ModelContentConditionInput | null > | null,
  or?: Array< ModelContentConditionInput | null > | null,
  not?: ModelContentConditionInput | null,
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

export type Content = {
  __typename: "Content",
  id: string,
  siteID: string,
  author?: string | null,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  media?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateContentInput = {
  id: string,
  siteID: string,
  author?: string | null,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  media?: string | null,
};

export type DeleteContentInput = {
  id: string,
  siteID: string,
};

export type CreateSiteInput = {
  id?: string | null,
  domain?: string | null,
  username?: string | null,
};

export type ModelSiteConditionInput = {
  domain?: ModelStringInput | null,
  username?: ModelStringInput | null,
  and?: Array< ModelSiteConditionInput | null > | null,
  or?: Array< ModelSiteConditionInput | null > | null,
  not?: ModelSiteConditionInput | null,
};

export type Site = {
  __typename: "Site",
  id: string,
  domain?: string | null,
  username?: string | null,
  contents?: ModelContentConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelContentConnection = {
  __typename: "ModelContentConnection",
  items:  Array<Content | null >,
  nextToken?: string | null,
};

export type UpdateSiteInput = {
  id: string,
  domain?: string | null,
  username?: string | null,
};

export type DeleteSiteInput = {
  id: string,
};

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
  author?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  content?: ModelStringInput | null,
  media?: ModelStringInput | null,
  and?: Array< ModelContentFilterInput | null > | null,
  or?: Array< ModelContentFilterInput | null > | null,
  not?: ModelContentFilterInput | null,
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

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSiteFilterInput = {
  id?: ModelIDInput | null,
  domain?: ModelStringInput | null,
  username?: ModelStringInput | null,
  and?: Array< ModelSiteFilterInput | null > | null,
  or?: Array< ModelSiteFilterInput | null > | null,
  not?: ModelSiteFilterInput | null,
};

export type ModelSiteConnection = {
  __typename: "ModelSiteConnection",
  items:  Array<Site | null >,
  nextToken?: string | null,
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
    author?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    createdAt: string,
    updatedAt: string,
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
    author?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    createdAt: string,
    updatedAt: string,
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
    author?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    createdAt: string,
    updatedAt: string,
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
    domain?: string | null,
    username?: string | null,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        author?: string | null,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        createdAt: string,
        updatedAt: string,
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
    domain?: string | null,
    username?: string | null,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        author?: string | null,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        createdAt: string,
        updatedAt: string,
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
    domain?: string | null,
    username?: string | null,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        author?: string | null,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        createdAt: string,
        updatedAt: string,
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
    author?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    createdAt: string,
    updatedAt: string,
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
      author?: string | null,
      title?: string | null,
      description?: string | null,
      content?: string | null,
      media?: string | null,
      createdAt: string,
      updatedAt: string,
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
    domain?: string | null,
    username?: string | null,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        author?: string | null,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        createdAt: string,
        updatedAt: string,
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
      domain?: string | null,
      username?: string | null,
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

export type SiteByDomainQueryVariables = {
  domain: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSiteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SiteByDomainQuery = {
  siteByDomain?:  {
    __typename: "ModelSiteConnection",
    items:  Array< {
      __typename: "Site",
      id: string,
      domain?: string | null,
      username?: string | null,
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
      domain?: string | null,
      username?: string | null,
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
    author?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    createdAt: string,
    updatedAt: string,
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
    author?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    createdAt: string,
    updatedAt: string,
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
    author?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    media?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateSiteSubscriptionVariables = {
  username?: string | null,
};

export type OnCreateSiteSubscription = {
  onCreateSite?:  {
    __typename: "Site",
    id: string,
    domain?: string | null,
    username?: string | null,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        author?: string | null,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        createdAt: string,
        updatedAt: string,
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
    domain?: string | null,
    username?: string | null,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        author?: string | null,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        createdAt: string,
        updatedAt: string,
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
    domain?: string | null,
    username?: string | null,
    contents?:  {
      __typename: "ModelContentConnection",
      items:  Array< {
        __typename: "Content",
        id: string,
        siteID: string,
        author?: string | null,
        title?: string | null,
        description?: string | null,
        content?: string | null,
        media?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
