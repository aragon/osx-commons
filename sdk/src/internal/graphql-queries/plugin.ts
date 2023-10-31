import {gql} from 'graphql-request';

export const QueryIPlugin = gql`
  query IPlugin($address: ID!, $where: IPlugin_filter!) {
    iplugin(id: $address, where: $where) {
      installations(where: {state: Installed}) {
        appliedPreparation {
          helpers
          pluginRepo {
            id
          }
        }
        appliedVersion {
          metadata
          build
          release {
            release
          }
        }
      }
    }
  }
`;
