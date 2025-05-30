export const AUTH_CONFIG = {
  google: {
    // 在 Google Cloud Console 中获取
    appClientId: process.env.GOOGLE_APP_CLIENT_ID || "",
    webClientId: process.env.GOOGLE_WEB_CLIENT_ID || "",
    // clientId: "204762997801-pnlmu8l3akspfebcvdua8furtine204n.apps.googleusercontent.com",
    appClientSecret: process.env.GOOGLE_APP_CLIENT_SECRET || "",
    webClientSecret: process.env.GOOGLE_WEB_CLIENT_SECRET || "",
  },
} as const;

// 配置 Google OAuth 2.0 scope
export const GOOGLE_SCOPES = ["profile", "email"] as const;
