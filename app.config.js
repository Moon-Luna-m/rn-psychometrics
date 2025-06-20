export default {
  expo: {
    name: "Echo",
    slug: "Echo",
    owner: "mac.zhao",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "echo",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    platforms: ["ios", "android", "web"],
    ios: {
      supportsTablet: true,
      backgroundColor: "#ffffff",
      bundleIdentifier: "com.mac.zhao.myapp",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: true,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.mac.zhao.myapp",
      usesCleartextTraffic: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/logo.png",
      backgroundColor: "#ffffff",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo.png",
          backgroundColor: "#FFF",
          imageWidth: 200,
        },
      ],
      "expo-localization",
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          usesNonExemptEncryption: false,
          faceIDPermission:
            "Allow $(Echo) to access your Face ID biometric data.",
        },
      ],
      "expo-web-browser",
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(Echo) to access your camera",
          microphonePermission: "Allow $(Echo) to access your microphone",
          recordAudioAndroid: true,
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "Allow $(Echo) to access your photos",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
          },
          ios: {},
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "de0c84ec-d1cd-4234-8c87-dba484ca91a6",
      },
      apiUrl: "http://192.168.5.180:9999",
      imgHost: "http://192.168.5.201:9000/echomind/",
      google: {
        appClientId: process.env.EXPO_PUBLIC_GOOGLE_APP_CLIENTID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENTID,
        appClientSecret: process.env.EXPO_PUBLIC_GOOGLE_APP_SECRET,
        webClientSecret: process.env.EXPO_PUBLIC_GOOGLE_WEB_SECRET,
        authCallback: process.env.EXPO_PUBLIC_GOOGLE_AUTH_CALLBACK,
      },
    },
  },
};
