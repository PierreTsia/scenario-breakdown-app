import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import router from "@/router/index";
import { LOG_IN, ME, SIGN_UP } from "@/api/index.queries";
import apolloClient from "@/api/apollo.client";
import { User } from "@/dtos/User.dto";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  username: string;
}

@Module
export class AuthModule extends VuexModule {
  currentUser: User | null = null;
  isLoading = false;
  error: unknown = null;

  @Mutation
  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }

  @Mutation
  setAuthLoading(state: boolean) {
    this.isLoading = state;
  }

  @Mutation
  setAuthError(error: unknown) {
    this.error = error;
  }

  @Action
  async login({ email, password }: LoginPayload) {
    this.setAuthError(false);
    this.setAuthLoading(true);
    localStorage.setItem("token", "");
    try {
      const { data } = await apolloClient.query({
        query: LOG_IN,
        variables: { email, password }
      });

      const { access_token: token, user } = data.login;
      localStorage.setItem("token", token);
      this.setCurrentUser(user);
      await router.push("/dashboard");
    } catch (e) {
      this.setAuthError(e ?? "Error login in");
      this.setAuthLoading(false);
    }
  }

  @Action
  async signup(payload: SignupPayload) {
    localStorage.setItem("token", "");
    try {
      const { data } = await apolloClient.mutate({
        mutation: SIGN_UP,
        variables: payload
      });
      const { access_token: token, user } = data.signup;
      this.setCurrentUser(user);

      localStorage.setItem("token", token);
      await router.push("/dashboard");
    } catch (e) {
      this.setAuthError(e);
    }
  }

  @Action
  async getCurrentUser() {
    try {
      const { data } = await apolloClient.query({ query: ME });
      this.setCurrentUser(data.me);
      this.setAuthLoading(false);
    } catch (e) {
      this.setAuthError(e);
      this.setAuthLoading(false);
    }
  }

  @Action
  async logout() {
    localStorage.setItem("token", "");
    this.setCurrentUser(null);
    await router.push("/");
  }
}

// register module (could be in any file)
import store from "@/store/index";
export const authModule = new AuthModule({ store, name: "auth" });
