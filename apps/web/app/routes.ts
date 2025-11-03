import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),

  layout("components/layout/authenticated-layout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("produtos", "routes/produtos.tsx"),
    route("analytics", "routes/analytics.tsx"),
    route("configuracoes", "routes/configuracoes.tsx"),
  ]),
] satisfies RouteConfig;
