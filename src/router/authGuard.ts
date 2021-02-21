import Vue from "vue/types/umd";
import { NavigationGuardNext, Route } from "vue-router";
import { authModule } from "@/store/modules/auth";

export default async (
  to: Route,
  from: Route,
  next: NavigationGuardNext<Vue>
) => {
  await authModule.getCurrentUser();
  switch (to.meta.name) {
    case "Dashboard":
      return authModule.currentUser ? next() : next({ path: "/" });
    case "Home":
      return authModule.currentUser ? next({ path: "/dashboard" }) : next();
    default:
      next();
  }
};
