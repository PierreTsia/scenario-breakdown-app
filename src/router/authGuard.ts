import Vue from "vue/types/umd";
import { NavigationGuardNext, Route } from "vue-router";
import { authModule } from "@/store/modules/auth";
import { appModule, Locale } from "@/store/modules/app";

export default async (
  to: Route,
  from: Route,
  next: NavigationGuardNext<Vue>
) => {
  const locale = (localStorage.getItem("locale") as Locale) ?? Locale.FR;
  appModule.setLocale(locale);

  switch (to.meta.name) {
    case "Dashboard":
      await authModule.getCurrentUser();
      return authModule.currentUser ? next() : next({ path: "/" });
    case "Home":
      if (from.meta.name === "Dashboard") {
        return next();
      } else {
        await authModule.getCurrentUser();
        return authModule.currentUser ? next({ path: "/dashboard" }) : next();
      }
  }
};
