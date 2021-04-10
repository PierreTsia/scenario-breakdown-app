import { RouteConfig } from "vue-router";
import AuthGuard from "./authGuard";

const routes: Array<RouteConfig> = [
  {
    path: "*",
    meta: {
      name: "",
      requiresAuth: true,
      layout: "default"
    },
    redirect: {
      path: "/"
    }
  },
  {
    path: "/",
    meta: {
      name: "Home",
      requiresAuth: false,
      layout: "default"
    },
    component: () => import(`@/views/LoginHome.vue`),
    beforeEnter: AuthGuard
  },
  {
    path: "/project/:id",
    name: "Project",
    meta: {
      requiresAuth: false,
      layout: "dashboard"
    },
    component: () => import(`@/views/ProjectView.vue`),
    children: [
      {
        path: "annotate",
        name: "Annotate",
        meta: {
          requiresAuth: false,
          layout: "dashboard"
        },
        component: () => import(`@/views/ProjectView.vue`)
      }
    ]
  },
  {
    path: "/dashboard",
    name: "dashboard",
    meta: {
      name: "Dashboard",
      requiresAuth: true,
      layout: "dashboard"
    },
    component: () => import(`@/views/DashboardView.vue`),
    beforeEnter: AuthGuard,
    children: [
      {
        path: "/dashboard/projects",
        name: "projects",
        meta: { layout: "dashboard" },
        component: () => import(`@/views/DashboardView.vue`)
      },
      {
        path: "/dashboard/settings",
        name: "settings",
        meta: { layout: "dashboard" },
        component: () => import(`@/views/DashboardView.vue`)
      }
    ]
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
