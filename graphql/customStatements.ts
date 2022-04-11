import { Content, ListContentsQuery } from './API';

export const siteByUsernameWithContents = /* GraphQL */ `
  query SiteByUsernameWithContents(
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
          items {
            author
            id
            content
            title
            siteID
            slug
            updatedAt
            createdAt
            description
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export type ListSitesWithContentQuery = {
  listSites?: {
    __typename: 'ModelSiteConnection';
    items: Array<{
      __typename: 'Site';
      id: string;
      subdomain?: string | null;
      customDomain?: string | null;
      username?: string | null;
      contents?: {
        items: Array<{
          __typename: 'Content';
          id: string;
          siteID: string;
          slug: string;
          author?: string | null;
          title?: string | null;
          description?: string | null;
          content?: string | null;
          media?: string | null;
          createdAt: string;
          updatedAt: string;
        } | null>;
      };
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export const ListSitesWithContents = /* GraphQL */ `
  query ListSitesWithContents(
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
        contents {
          nextToken
          items {
            author
            id
            content
            title
            siteID
            slug
            updatedAt
            createdAt
            description
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
