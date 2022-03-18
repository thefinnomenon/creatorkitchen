/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreatePostInput = {
  id?: string | null,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  status?: string | null,
  username?: string | null,
  media?: string | null,
  coverImage?: string | null,
};

export type ModelPostConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  content?: ModelStringInput | null,
  status?: ModelStringInput | null,
  username?: ModelStringInput | null,
  media?: ModelStringInput | null,
  coverImage?: ModelStringInput | null,
  and?: Array< ModelPostConditionInput | null > | null,
  or?: Array< ModelPostConditionInput | null > | null,
  not?: ModelPostConditionInput | null,
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

export type Post = {
  __typename: "Post",
  id: string,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  status?: string | null,
  username?: string | null,
  media?: string | null,
  coverImage?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdatePostInput = {
  id: string,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  status?: string | null,
  username?: string | null,
  media?: string | null,
  coverImage?: string | null,
};

export type DeletePostInput = {
  id: string,
};

export type CreateContentInput = {
  id?: string | null,
  contentID: string,
  status?: string | null,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  username?: string | null,
  media?: string | null,
  coverImage?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelContentConditionInput = {
  contentID?: ModelIDInput | null,
  status?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  content?: ModelStringInput | null,
  username?: ModelStringInput | null,
  media?: ModelStringInput | null,
  coverImage?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelContentConditionInput | null > | null,
  or?: Array< ModelContentConditionInput | null > | null,
  not?: ModelContentConditionInput | null,
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

export type Content = {
  __typename: "Content",
  id: string,
  contentID: string,
  status?: string | null,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  username?: string | null,
  media?: string | null,
  coverImage?: string | null,
  createdAt: string,
  updatedAt?: string | null,
};

export type UpdateContentInput = {
  id: string,
  contentID?: string | null,
  status?: string | null,
  title?: string | null,
  description?: string | null,
  content?: string | null,
  username?: string | null,
  media?: string | null,
  coverImage?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteContentInput = {
  id: string,
};

export type ModelPostFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  content?: ModelStringInput | null,
  status?: ModelStringInput | null,
  username?: ModelStringInput | null,
  media?: ModelStringInput | null,
  coverImage?: ModelStringInput | null,
  and?: Array< ModelPostFilterInput | null > | null,
  or?: Array< ModelPostFilterInput | null > | null,
  not?: ModelPostFilterInput | null,
};

export type ModelPostConnection = {
  __typename: "ModelPostConnection",
  items:  Array<Post | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelContentFilterInput = {
  id?: ModelIDInput | null,
  contentID?: ModelIDInput | null,
  status?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  content?: ModelStringInput | null,
  username?: ModelStringInput | null,
  media?: ModelStringInput | null,
  coverImage?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelContentFilterInput | null > | null,
  or?: Array< ModelContentFilterInput | null > | null,
  not?: ModelContentFilterInput | null,
};

export type ModelContentConnection = {
  __typename: "ModelContentConnection",
  items:  Array<Content | null >,
  nextToken?: string | null,
};

export type CreatePostMutationVariables = {
  input: CreatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type CreatePostMutation = {
  createPost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    status?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePostMutationVariables = {
  input: UpdatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type UpdatePostMutation = {
  updatePost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    status?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePostMutationVariables = {
  input: DeletePostInput,
  condition?: ModelPostConditionInput | null,
};

export type DeletePostMutation = {
  deletePost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    status?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt: string,
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
    contentID: string,
    status?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt?: string | null,
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
    contentID: string,
    status?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt?: string | null,
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
    contentID: string,
    status?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt?: string | null,
  } | null,
};

export type GetPostQueryVariables = {
  id: string,
};

export type GetPostQuery = {
  getPost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    status?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPostsQueryVariables = {
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostsQuery = {
  listPosts?:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      title?: string | null,
      description?: string | null,
      content?: string | null,
      status?: string | null,
      username?: string | null,
      media?: string | null,
      coverImage?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PostsByUsernameQueryVariables = {
  username?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PostsByUsernameQuery = {
  postsByUsername?:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      title?: string | null,
      description?: string | null,
      content?: string | null,
      status?: string | null,
      username?: string | null,
      media?: string | null,
      coverImage?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetContentQueryVariables = {
  id: string,
};

export type GetContentQuery = {
  getContent?:  {
    __typename: "Content",
    id: string,
    contentID: string,
    status?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt?: string | null,
  } | null,
};

export type ListContentsQueryVariables = {
  filter?: ModelContentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListContentsQuery = {
  listContents?:  {
    __typename: "ModelContentConnection",
    items:  Array< {
      __typename: "Content",
      id: string,
      contentID: string,
      status?: string | null,
      title?: string | null,
      description?: string | null,
      content?: string | null,
      username?: string | null,
      media?: string | null,
      coverImage?: string | null,
      createdAt: string,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ContentByUsernameQueryVariables = {
  username?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelContentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ContentByUsernameQuery = {
  contentByUsername?:  {
    __typename: "ModelContentConnection",
    items:  Array< {
      __typename: "Content",
      id: string,
      contentID: string,
      status?: string | null,
      title?: string | null,
      description?: string | null,
      content?: string | null,
      username?: string | null,
      media?: string | null,
      coverImage?: string | null,
      createdAt: string,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreatePostSubscriptionVariables = {
  username?: string | null,
};

export type OnCreatePostSubscription = {
  onCreatePost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    status?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePostSubscriptionVariables = {
  username?: string | null,
};

export type OnUpdatePostSubscription = {
  onUpdatePost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    status?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePostSubscriptionVariables = {
  username?: string | null,
};

export type OnDeletePostSubscription = {
  onDeletePost?:  {
    __typename: "Post",
    id: string,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    status?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateContentSubscriptionVariables = {
  username?: string | null,
};

export type OnCreateContentSubscription = {
  onCreateContent?:  {
    __typename: "Content",
    id: string,
    contentID: string,
    status?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateContentSubscriptionVariables = {
  username?: string | null,
};

export type OnUpdateContentSubscription = {
  onUpdateContent?:  {
    __typename: "Content",
    id: string,
    contentID: string,
    status?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteContentSubscriptionVariables = {
  username?: string | null,
};

export type OnDeleteContentSubscription = {
  onDeleteContent?:  {
    __typename: "Content",
    id: string,
    contentID: string,
    status?: string | null,
    title?: string | null,
    description?: string | null,
    content?: string | null,
    username?: string | null,
    media?: string | null,
    coverImage?: string | null,
    createdAt: string,
    updatedAt?: string | null,
  } | null,
};
