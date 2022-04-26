/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateContent = /* GraphQL */ `
  subscription OnCreateContent($author: String) {
    onCreateContent(author: $author) {
      id
      siteID
      parentID
      slug
      published {
        items {
          id
          siteID
          parentID
          slug
          author
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
        }
        nextToken
      }
      author
      title
      description
      content
      media
      status
      originalCreatedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateContent = /* GraphQL */ `
  subscription OnUpdateContent($author: String) {
    onUpdateContent(author: $author) {
      id
      siteID
      parentID
      slug
      published {
        items {
          id
          siteID
          parentID
          slug
          author
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
        }
        nextToken
      }
      author
      title
      description
      content
      media
      status
      originalCreatedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteContent = /* GraphQL */ `
  subscription OnDeleteContent($author: String) {
    onDeleteContent(author: $author) {
      id
      siteID
      parentID
      slug
      published {
        items {
          id
          siteID
          parentID
          slug
          author
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
        }
        nextToken
      }
      author
      title
      description
      content
      media
      status
      originalCreatedAt
      createdAt
      updatedAt
    }
  }
`;
export const onCreateSite = /* GraphQL */ `
  subscription OnCreateSite($username: String) {
    onCreateSite(username: $username) {
      id
      subdomain
      customDomain
      username
      title
      description
      contents {
        items {
          id
          siteID
          parentID
          slug
          author
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSite = /* GraphQL */ `
  subscription OnUpdateSite($username: String) {
    onUpdateSite(username: $username) {
      id
      subdomain
      customDomain
      username
      title
      description
      contents {
        items {
          id
          siteID
          parentID
          slug
          author
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteSite = /* GraphQL */ `
  subscription OnDeleteSite($username: String) {
    onDeleteSite(username: $username) {
      id
      subdomain
      customDomain
      username
      title
      description
      contents {
        items {
          id
          siteID
          parentID
          slug
          author
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
