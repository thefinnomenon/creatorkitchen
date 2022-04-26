import { Content, ContentStatus, ListContentsQuery } from './API';

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
            status
            published {
              items {
                id
                siteID
                slug
                createdAt
                updatedAt
                status
              }
              nextToken
            }
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export type ContentAndPublishedBySiteAndSlugQuery = {
  contentBySiteAndSlug?: {
    __typename: 'ModelContentConnection';
    items: Array<{
      __typename: 'Content';
      id: string;
      siteID: string;
      slug: string;
      published?: {
        items: Array<{
          __typename: 'Content';
          id: string;
          siteID: string;
          slug: string;
          status: ContentStatus;
          createdAt: string;
          updatedAt: string;
        } | null>;
      };
      author?: string | null;
      title?: string | null;
      description?: string | null;
      content?: string | null;
      media?: string | null;
      status?: ContentStatus | null;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

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
          published?: {
            items: Array<{
              __typename: 'Content';
              id: string;
              siteID: string;
              slug: string;
              createdAt: string;
              updatedAt: string;
              status: ContentStatus;
            } | null>;
          };
          status: ContentStatus;
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
  query ListSitesWithContents($filter: ModelSiteFilterInput, $limit: Int, $nextToken: String) {
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
            status
            published {
              nextToken
              items {
                id
                siteID
                slug
                author
                title
                description
                content
                media
                status
                createdAt
                updatedAt
              }
            }
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const contentAndPublishedBySiteAndSlug = /* GraphQL */ `
  query ContentAndPublishedBySiteAndSlug(
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
        slug
        published {
          nextToken
          items {
            id
            siteID
            slug
            author
            title
            description
            content
            media
            status
            createdAt
            updatedAt
          }
        }
        author
        title
        description
        content
        media
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
