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
