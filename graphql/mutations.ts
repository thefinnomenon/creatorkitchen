/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createContent = /* GraphQL */ `
  mutation CreateContent(
    $input: CreateContentInput!
    $condition: ModelContentConditionInput
  ) {
    createContent(input: $input, condition: $condition) {
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
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
          contentAuthorId
        }
        nextToken
      }
      author {
        id
        avatarUrl
        name
        bio
        links
        createdAt
        updatedAt
        username
      }
      title
      description
      content
      media
      status
      originalCreatedAt
      createdAt
      updatedAt
      contentAuthorId
    }
  }
`;
export const updateContent = /* GraphQL */ `
  mutation UpdateContent(
    $input: UpdateContentInput!
    $condition: ModelContentConditionInput
  ) {
    updateContent(input: $input, condition: $condition) {
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
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
          contentAuthorId
        }
        nextToken
      }
      author {
        id
        avatarUrl
        name
        bio
        links
        createdAt
        updatedAt
        username
      }
      title
      description
      content
      media
      status
      originalCreatedAt
      createdAt
      updatedAt
      contentAuthorId
    }
  }
`;
export const deleteContent = /* GraphQL */ `
  mutation DeleteContent(
    $input: DeleteContentInput!
    $condition: ModelContentConditionInput
  ) {
    deleteContent(input: $input, condition: $condition) {
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
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
          contentAuthorId
        }
        nextToken
      }
      author {
        id
        avatarUrl
        name
        bio
        links
        createdAt
        updatedAt
        username
      }
      title
      description
      content
      media
      status
      originalCreatedAt
      createdAt
      updatedAt
      contentAuthorId
    }
  }
`;
export const createAuthor = /* GraphQL */ `
  mutation CreateAuthor(
    $input: CreateAuthorInput!
    $condition: ModelAuthorConditionInput
  ) {
    createAuthor(input: $input, condition: $condition) {
      id
      avatarUrl
      name
      bio
      links
      createdAt
      updatedAt
      username
    }
  }
`;
export const updateAuthor = /* GraphQL */ `
  mutation UpdateAuthor(
    $input: UpdateAuthorInput!
    $condition: ModelAuthorConditionInput
  ) {
    updateAuthor(input: $input, condition: $condition) {
      id
      avatarUrl
      name
      bio
      links
      createdAt
      updatedAt
      username
    }
  }
`;
export const deleteAuthor = /* GraphQL */ `
  mutation DeleteAuthor(
    $input: DeleteAuthorInput!
    $condition: ModelAuthorConditionInput
  ) {
    deleteAuthor(input: $input, condition: $condition) {
      id
      avatarUrl
      name
      bio
      links
      createdAt
      updatedAt
      username
    }
  }
`;
export const createSite = /* GraphQL */ `
  mutation CreateSite(
    $input: CreateSiteInput!
    $condition: ModelSiteConditionInput
  ) {
    createSite(input: $input, condition: $condition) {
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
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
          contentAuthorId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateSite = /* GraphQL */ `
  mutation UpdateSite(
    $input: UpdateSiteInput!
    $condition: ModelSiteConditionInput
  ) {
    updateSite(input: $input, condition: $condition) {
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
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
          contentAuthorId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteSite = /* GraphQL */ `
  mutation DeleteSite(
    $input: DeleteSiteInput!
    $condition: ModelSiteConditionInput
  ) {
    deleteSite(input: $input, condition: $condition) {
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
          title
          description
          content
          media
          status
          originalCreatedAt
          createdAt
          updatedAt
          contentAuthorId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
