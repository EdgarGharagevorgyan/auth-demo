import Constants from "expo-constants";

const extra = (Constants?.expoConfig?.extra ?? {}) as { API_URL?: string };

export const ENV = {
    // change to your LAN IP if testing on a real device, keep 10.0.2.2 for Android emulator
    API_URL: extra.API_URL ?? "http://10.0.2.2:3000",
};
