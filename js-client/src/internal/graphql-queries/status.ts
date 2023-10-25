import { gql } from 'graphql-request';

export const QueryStatus = gql`
  {
    _meta {
      deployment
    }
  }
`;
