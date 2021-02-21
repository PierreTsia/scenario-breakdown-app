import ApolloClient from "apollo-boost";

const BASE_URL = "https://scenario-breakdown-api.herokuapp.com/";
const formatErrors = (arg: any) => {
  return arg;
};

const apolloClient = new ApolloClient({
  uri: `${BASE_URL}/graphql`,
  fetchOptions: {
    credentials: "include"
  },
  request: (operation: any) => operation,
  onError: ({ graphQLErrors, networkError }: any) =>
    formatErrors({ graphQLErrors, networkError })
});

export default apolloClient;
