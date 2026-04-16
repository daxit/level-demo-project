import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['codegen/graphql/**/*.graphql'],
  generates: {
    './src/gql/': {
      preset: 'client',
    },
  },
};

export default config;
