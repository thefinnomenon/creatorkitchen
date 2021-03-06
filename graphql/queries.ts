/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getContent = /* GraphQL */ `
  query GetContent($id: ID!, $siteID: ID!) {
    getContent(id: $id, siteID: $siteID) {
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
        parentID
        slug
        published {
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
      nextToken
    }
  }
`;
export const contentByParentID = /* GraphQL */ `
  query ContentByParentID(
    $parentID: ID!
    $siteID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contentByParentID(
      parentID: $parentID
      siteID: $siteID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        siteID
        parentID
        slug
        published {
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
      nextToken
    }
  }
`;
export const contentBySiteAndSlug = /* GraphQL */ `
  query ContentBySiteAndSlug(
    $slug: String!
    $siteID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelContentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contentBySiteAndSlug(
      slug: $slug
      siteID: $siteID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        siteID
        parentID
        slug
        published {
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
      nextToken
    }
  }
`;
export const getAuthor = /* GraphQL */ `
  query GetAuthor($id: ID!) {
    getAuthor(id: $id) {
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
export const listAuthors = /* GraphQL */ `
  query ListAuthors(
    $filter: ModelAuthorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAuthors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        avatarUrl
        name
        bio
        links
        createdAt
        updatedAt
        username
      }
      nextToken
    }
  }
`;
export const getSite = /* GraphQL */ `
  query GetSite($id: ID!) {
    getSite(id: $id) {
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
export const listSites = /* GraphQL */ `
  query ListSites(
    $filter: ModelSiteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSites(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        subdomain
        customDomain
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
export const siteBySubdomain = /* GraphQL */ `
  query SiteBySubdomain(
    $subdomain: String!
    $sortDirection: ModelSortDirection
    $filter: ModelSiteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    siteBySubdomain(
      subdomain: $subdomain
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        subdomain
        customDomain
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
export const siteByCustomDomain = /* GraphQL */ `
  query SiteByCustomDomain(
    $customDomain: String!
    $sortDirection: ModelSortDirection
    $filter: ModelSiteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    siteByCustomDomain(
      customDomain: $customDomain
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        subdomain
        customDomain
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
        subdomain
        customDomain
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
