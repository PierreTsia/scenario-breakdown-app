import ApolloClient from "apollo-boost";
import { BASE_URL } from "@/constants";
import { authModule } from "@/store/modules/auth";
import { GraphQLError } from "graphql";

const formatErrors = ({
  graphQLErrors,
  networkError
}: {
  graphQLErrors?: readonly GraphQLError[];
  networkError?: Error;
}) => {
  if (networkError) {
    console.log("[NETWORK ERROR]", networkError);
  }
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.dir(err);
      if (err.name === "AuthenticationError") {
        console.warn(err);
        authModule.setAuthError(err);
        authModule.logout();
      }
    }
  }
};

const apolloClient = new ApolloClient({
  uri: `${BASE_URL}/graphql`,
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    // auth headers
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }
    operation.setContext({
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) =>
    formatErrors({ graphQLErrors, networkError })
});

export default apolloClient;
