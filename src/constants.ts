export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://scenario-breakdown-api.herokuapp.com";

export const FIVE_MIN_IN_MS = 300000;
