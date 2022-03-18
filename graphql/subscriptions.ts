/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost($username: String) {
    onCreatePost(username: $username) {
      id
      title
      description
      content
      status
      username
      media
      coverImage
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost($username: String) {
    onUpdatePost(username: $username) {
      id
      title
      description
      content
      status
      username
      media
      coverImage
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost($username: String) {
    onDeletePost(username: $username) {
      id
      title
      description
      content
      status
      username
      media
      coverImage
      createdAt
      updatedAt
    }
  }
`;
export const onCreateContent = /* GraphQL */ `
  subscription OnCreateContent($username: String) {
    onCreateContent(username: $username) {
      id
      contentID
      status
      title
      description
      content
      username
      media
      coverImage
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateContent = /* GraphQL */ `
  subscription OnUpdateContent($username: String) {
    onUpdateContent(username: $username) {
      id
      contentID
      status
      title
      description
      content
      username
      media
      coverImage
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteContent = /* GraphQL */ `
  subscription OnDeleteContent($username: String) {
    onDeleteContent(username: $username) {
      id
      contentID
      status
      title
      description
      content
      username
      media
      coverImage
      createdAt
      updatedAt
    }
  }
`;
