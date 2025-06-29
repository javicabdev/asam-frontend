// GraphQL Config for IDE support
module.exports = {
  projects: {
    default: {
      schema: ['./src/graphql/schema.json'],
      documents: ['src/**/*.{graphql,js,ts,jsx,tsx}'],
      extensions: {
        endpoints: {
          default: {
            url: 'http://localhost:8080/graphql',
          },
        },
      },
    },
  },
};
