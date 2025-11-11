/* eslint-disable @typescript-eslint/no-explicit-any */
export const CLIENT_ID =
  "943556130775-fbsgln3igbohm502mhhomn0e8q2895gj.apps.googleusercontent.com";

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

// Type for storing multiple channel tokens
export interface ChannelToken {
  channelId: string;
  accessToken: string;
  channelTitle: string;
}

const CHANNELS_KEY = "yt_channels_tokens";

export const youtubeAuthService = {
  /**
   * Load Google API scripts
   */
  loadScripts: (): Promise<void> => {
    return new Promise((resolve) => {
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
   * Authenticate user and add channel to stored tokens
   */
  authenticateChannel: async (): Promise<ChannelToken | null> => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.gapi) {
        return reject("Google scripts not loaded yet");
      }

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (tokenResponse: any) => {
          if (!tokenResponse.access_token) return reject("No access token");

          // Set token for gapi
          window.gapi.client.setToken({
            access_token: tokenResponse.access_token,
          });

          // Load YouTube APIs
          await window.gapi.client.load("youtubeAnalytics", "v2");
          await window.gapi.client.load("youtube", "v3");

          // Fetch user channels
          const res = await window.gapi.client.youtube.channels.list({
            part: "snippet,contentDetails",
            mine: true,
            maxResults: 50,
          });

          if (!res.result.items || res.result.items.length === 0)
            return reject("No channels found");

          // Pick first channel for simplicity (user can select later)
          const channel = res.result.items[0];
          const channelToken: ChannelToken = {
            channelId: channel.id,
            accessToken: tokenResponse.access_token,
            channelTitle: channel.snippet.title,
          };

          // Save in localStorage
          const stored = youtubeAuthService.getStoredChannels();
          const updated = [
            ...stored.filter((c) => c.channelId !== channelToken.channelId),
            channelToken,
          ];
          localStorage.setItem(CHANNELS_KEY, JSON.stringify(updated));

          resolve(channelToken);
        },
      });

      tokenClient.requestAccessToken();
    });
  },

  /**
   * Get all stored channel tokens
   */
  getStoredChannels: (): ChannelToken[] => {
    const data = localStorage.getItem(CHANNELS_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as ChannelToken[];
    } catch {
      return [];
    }
  },

  /**
   * Remove a channel from stored tokens
   */
  removeChannel: (channelId: string) => {
    const stored = youtubeAuthService.getStoredChannels();
    const updated = stored.filter((c) => c.channelId !== channelId);
    localStorage.setItem(CHANNELS_KEY, JSON.stringify(updated));
  },

  /**
   * Get a channel token by channelId
   */
  getTokenByChannelId: (channelId: string): string | null => {
    const stored = youtubeAuthService.getStoredChannels();
    const channel = stored.find((c) => c.channelId === channelId);
    return channel ? channel.accessToken : null;
  },
};
