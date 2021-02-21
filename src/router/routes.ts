import { RouteConfig } from "vue-router";

const routes: Array<RouteConfig> = [
  {
    path: "*",
    meta: {
      name: "",
      requiresAuth: true,
      layout: "dashboard"
    },
    redirect: {
      path: "/dashboard"
    }
  },
  // This  allows you to have pages apart of the app but no rendered inside the dash
  {
    path: "/",
    meta: {
      name: "",
      requiresAuth: false,
      layout: "default"
    },
    component: () =>
      import(/* webpackChunkName: "routes" */ `@/views/LoginHome.vue`)
    // redirect if already signed in
    /*beforeEnter: (to, from, next) => {
      if (store.getters.authorized) {
        next("/dashboard");
      } else {
        next();
      }
    },*/
    /*children: [
      {
        path: "",
        component: () => import(`@/components/LoginCard.vue`)
      }
    ]*/
  },
  // add any extra routes that you want rendered in the dashboard as a child below. Change toolbar names here
  {
    path: "/dashboard",
    meta: {
      name: "Dashboard View",
      requiresAuth: true,
      layout: "dashboard"
    },
    component: () => import(`@/views/DashboardView.vue`)
    /* children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import(`@/components/DashViews/Dashboard.vue`)
      },
      {
        path: "user-profile",
        meta: {
          name: "User Profile",
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/UserProfile.vue`)
      },
      {
        path: "table-list",
        meta: {
          name: "Table List",
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/SimpleTables.vue`)
      },
      {
        path: "user-tables",
        meta: {
          name: "User Table",
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/UsersTable.vue`)
      },
      {
        path: "tablestest",
        meta: {
          name: "Complex Tables test",
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/TableList.vue`)
      },
      {
        path: "typography",
        meta: {
          name: "Typography",
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/Typography.vue`)
      },
      {
        path: "icons",
        meta: {
          name: "Icons",
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/Icons.vue`)
      },
      {
        path: "maps",
        meta: {
          name: "Maps",
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/Maps.vue`)
      },
      {
        path: "notifications",
        meta: {
          name: "Notifications",
          requiresAuth: true
        },
        component: () => import(`@/components/DashViews/Notifications.vue`)
      }
    ]*/
  }
];

export default routes;
