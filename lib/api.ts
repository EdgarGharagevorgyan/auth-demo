import { ENV } from "../config/env";
import { getToken } from "./auth";

type Opts = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
};

export async function api(path: string, opts: Opts = {}) {
    const base = ENV.API_URL.replace(/\/+$/, "");
    const fullUrl = `${base}${path.startsWith("/") ? path : `/${path}`}`;

    const token = getToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(opts.headers || {}),
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    console.log("API →", opts.method ?? "GET", fullUrl);

    const res = await fetch(fullUrl, {
        method: opts.method ?? "GET",
        headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

    const text = await res.text();
    let data: any;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
        throw new Error(msg);
    }
    return data;
}
