import { env } from "@cashory-demo/env/native";
import Constants from "expo-constants";

function getExpoHost(): string | null {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.developer?.tool,
    Constants.manifest2?.extra?.expoClient?.hostUri,
  ].filter((value): value is string => typeof value === "string" && value.length > 0);

  for (const candidate of candidates) {
    const host = candidate.split(":")[0];

    if (host) {
      return host;
    }
  }

  return null;
}

function rewriteLocalhostUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const isLocalHost =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "::1";

    if (!isLocalHost) {
      return rawUrl;
    }

    const expoHost = getExpoHost();

    if (!expoHost) {
      return rawUrl;
    }

    parsed.hostname = expoHost;
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return rawUrl;
  }
}

export const serverBaseUrl = rewriteLocalhostUrl(env.EXPO_PUBLIC_SERVER_URL);
