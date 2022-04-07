/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getContent = /* GraphQL */ `
  query GetContent($id: ID!, $siteID: ID!) {
    getContent(id: $id, siteID: $siteID) {
      id
      siteID
      author
      title
      description
      content
      media
      createdAt
      updatedAt
    }
  }
`;
export const listContents = /* GraphQL */ `
  query ListContents(
    $id: ID
    $siteID: ModelIDKeyConditionInput
    $filter: ModelContentFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listContents(
      id: $id
      siteID: $siteID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        siteID
        author
        title
        description
        content
        media
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSite = /* GraphQL */ `
  query GetSite($id: ID!) {
    getSite(id: $id) {
      id
      domain
      username
      title
      description
      contents {
        items {
          id
          siteID
          author
          title
          description
          content
          media
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
export const listSites = /* GraphQL */ `
  query ListSites(
    $filter: ModelSiteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSites(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        domain
        username
        title
        description
        contents {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const siteByDomain = /* GraphQL */ `
  query SiteByDomain(
    $domain: String!
    $sortDirection: ModelSortDirection
    $filter: ModelSiteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    siteByDomain(
      domain: $domain
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        domain
        username
        title
        description
        contents {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const siteByUsername = /* GraphQL */ `
  query SiteByUsername(
    $username: String!
    $sortDirection: ModelSortDirection
    $filter: ModelSiteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    siteByUsername(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        domain
        username
        title
        description
        contents {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
