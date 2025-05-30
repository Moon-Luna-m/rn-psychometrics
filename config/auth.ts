export const AUTH_CONFIG = {
  google: {
    // 在 Google Cloud Console 中获取
    appClientId: process.env.EXPO_PUBLIC_GOOGLE_APP_CLIENTID || "",
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENTID || "",
    // clientId: "204762997801-pnlmu8l3akspfebcvdua8furtine204n.apps.googleusercontent.com",
    appClientSecret: process.env.EXPO_PUBLIC_GOOGLE_APP_SECRET || "",
    webClientSecret: process.env.EXPO_PUBLIC_GOOGLE_WEB_SECRET || "",
  },
} as const;

// 配置 Google OAuth 2.0 scope
export const GOOGLE_SCOPES = ["profile", "email"] as const;
