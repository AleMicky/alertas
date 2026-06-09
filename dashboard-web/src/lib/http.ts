import axios from "axios";
import { getSession } from "next-auth/react";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

http.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const session = await getSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});
