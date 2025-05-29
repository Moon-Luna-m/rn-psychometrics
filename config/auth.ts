import { Platform } from "react-native";

export const AUTH_CONFIG = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUrl: Platform.select({
      ios: "com.googleusercontent.apps.[YOUR_CLIENT_ID]:/oauth2redirect",
      android: "com.googleusercontent.apps.[YOUR_CLIENT_ID]:/oauth2redirect",
    }),
  },
};

export const SCOPES = [
  "openid",
  "profile",
  "email"
] as const; 