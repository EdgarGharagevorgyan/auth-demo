import Constants from "expo-constants";
const extra = (Constants?.expoConfig?.extra ?? {}) as { API_URL?: string };

export const ENV = {
    API_URL: extra.API_URL ?? "http://10.0.2.2:4000",
};
