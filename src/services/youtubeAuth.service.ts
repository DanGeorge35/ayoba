/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const CLIENT_ID =
  "943556130775-fbsgln3igbohm502mhhomn0e8q2895gj.apps.googleusercontent.com";

export const REDIRECT_URI = "http://localhost:3000/admin/google/callback"; // Must match OAuth credentials
export const BACKEND_URL = "http://localhost:3000/admin"; // Your backend endpoint

export const SCOPES = [
  "https://www.googleapis.com/auth/yt-analytics.readonly",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtubepartner",
  "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
].join(" ");

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export interface ChannelToken {
  channelId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp when token expires
  channelTitle: string;
  thumbnail: string;
}

const CHANNELS_KEY = "yt_channels_tokens";

export const youtubeAuthService = {
  /**
   * Load Google API scripts
   */
  loadScripts: (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.gapi) return resolve(); // Already loaded

      const gapiScript = document.createElement("script");
      gapiScript.src = "https://apis.google.com/js/api.js";
      gapiScript.async = true;
      gapiScript.onload = () => {
        window.gapi.load("client", resolve);
      };
      document.body.appendChild(gapiScript);

      const gisScript = document.createElement("script");
      gisScript.src = "https://accounts.google.com/gsi/client";
      gisScript.async = true;
      document.body.appendChild(gisScript);
    });
  },

  /**
   * Open OAuth popup and return authorization code
   */
  getAuthCode: (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.search = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: "code",
        scope: SCOPES,
        access_type: "offline",
        prompt: "consent",
      }).toString();

      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl.toString(),
        "google_oauth",
        `width=${width},height=${height},top=${top},left=${left}`
      );

      if (!popup) return reject("Popup blocked");

      const listener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data.type === "google_oauth_code") {
          window.removeEventListener("message", listener);
          popup.close();
          resolve(event.data.code);
        }
      };

      window.addEventListener("message", listener);
    });
  },

  /**
   * Exchange authorization code for tokens via backend
   */
  exchangeCodeForTokens: async (code: string): Promise<ChannelToken | null> => {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/exchange-code`, {
        code,
      });
      const { access_token, refresh_token, expires_in } = data;

      await youtubeAuthService.loadScripts();
      await window.gapi.client.load("youtube", "v3");
      window.gapi.client.setToken({ access_token });

      const res = await window.gapi.client.youtube.channels.list({
        part: "snippet,contentDetails",
        mine: true,
        maxResults: 1,
      });

      if (!res.result.items || res.result.items.length === 0) return null;

      const channel = res.result.items[0];
      const expiresAt = Date.now() + expires_in * 1000;

      const tokenData: ChannelToken = {
        channelId: channel.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
        channelTitle: channel.snippet.title,
        thumbnail: channel.snippet.thumbnails?.default?.url ?? "",
      };

      youtubeAuthService.saveChannel(tokenData);
      return tokenData;
    } catch (err) {
      console.error("Token exchange failed:", err);
      return null;
    }
  },

  /**
   * Authenticate channel (popup + exchange tokens)
   */
  authenticateChannel: async (): Promise<ChannelToken | null> => {
    const code = await youtubeAuthService.getAuthCode();
    return youtubeAuthService.exchangeCodeForTokens(code);
  },

  /**
   * Local storage helpers
   */
  saveChannel: (channel: ChannelToken) => {
    const all = youtubeAuthService.getStoredChannels();
    const updated = [
      ...all.filter((c) => c.channelId !== channel.channelId),
      channel,
    ];
    localStorage.setItem(CHANNELS_KEY, JSON.stringify(updated));
  },

  getStoredChannels: (): ChannelToken[] => {
    try {
      return JSON.parse(localStorage.getItem(CHANNELS_KEY) || "[]");
    } catch {
      return [];
    }
  },

  getChannel: (channelId: string): ChannelToken | null => {
    return (
      youtubeAuthService
        .getStoredChannels()
        .find((c) => c.channelId === channelId) || null
    );
  },

  removeChannel: (channelId: string) => {
    const updated = youtubeAuthService
      .getStoredChannels()
      .filter((c) => c.channelId !== channelId);
    localStorage.setItem(CHANNELS_KEY, JSON.stringify(updated));
  },
};
