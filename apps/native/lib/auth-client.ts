import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth as serverAuth } from "@cashory-demo/auth";
import { serverBaseUrl } from "./server-url";

export const authClient = createAuthClient({
  baseURL: serverBaseUrl,
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storagePrefix: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
    }),
    inferAdditionalFields<typeof serverAuth>(),
  ],
});
