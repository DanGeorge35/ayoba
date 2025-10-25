/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

// OAuth credentials
const CLIENT_ID =
  "943556130775-fbsgln3igbohm502mhhomn0e8q2895gj.apps.googleusercontent.com";
const API_KEY = "AIzaSyCKjx6yHE9L4RS-btVJsm2kxmuEtpciIbM";

const SCOPES = [
  "https://www.googleapis.com/auth/yt-analytics.readonly",
  "https://www.googleapis.com/auth/youtube.readonly",
].join(" ");

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

interface ChannelStats {
  title: string;
  thumbnail: string;
  subscribers: string;
  views: string;
  videos: string;
  description?: string;
}

const YouTubeAnalytics: React.FC = () => {
  const [gisLoaded, setGisLoaded] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [analytics, setAnalytics] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [channelId, setChannelId] = useState("");
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Load GAPI and GIS scripts
  useEffect(() => {
    const gapiScript = document.createElement("script");
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.async = true;
    gapiScript.onload = () => {
      window.gapi.load("client", async () => {
        setGapiLoaded(true);
        console.log("GAPI loaded");
      });
    };
    document.body.appendChild(gapiScript);

    const gisScript = document.createElement("script");
    gisScript.src = "https://accounts.google.com/gsi/client";
    gisScript.async = true;
    gisScript.onload = () => {
      setGisLoaded(true);
      console.log("GIS loaded");
    };
    document.body.appendChild(gisScript);

    return () => {
      document.body.removeChild(gapiScript);
      document.body.removeChild(gisScript);
    };
  }, []);

  // Keep login state
  useEffect(() => {
    const storedToken = sessionStorage.getItem("yt_token");
    const storedName = sessionStorage.getItem("yt_name");
    if (storedToken && storedName) {
      window.gapi?.client.setToken({ access_token: storedToken });
      setIsSignedIn(true);
      setUserName(storedName);
    }

    // default 2-month range
    const today = new Date();
    const priorDate = new Date();
    priorDate.setMonth(priorDate.getMonth() - 2);
    setStartDate(priorDate.toISOString().slice(0, 10));
    setEndDate(today.toISOString().slice(0, 10));
  }, [gapiLoaded]);

  // OAuth login with GIS
  const authenticate = async (): Promise<void> => {
    if (!gisLoaded || !gapiLoaded) return alert("Google scripts not loaded yet");

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (tokenResponse: any) => {
        if (tokenResponse.access_token) {
          window.gapi.client.setToken({ access_token: tokenResponse.access_token });
          setIsSignedIn(true);
          sessionStorage.setItem("yt_token", tokenResponse.access_token);

          // Load YouTube Analytics API
          await window.gapi.client.load("youtubeAnalytics", "v2");
          console.log("YouTube Analytics API loaded");

          // Fetch user info for name
          const userRes = await window.gapi.client.youtube.channels.list({
            part: "snippet",
            mine: true,
          });
          const name = userRes.result.items[0].snippet.title;
          setUserName(name);
          sessionStorage.setItem("yt_name", name);
        }
      },
    });

    tokenClient.requestAccessToken();
  };

  const logout = () => {
    window.gapi.client.setToken({ access_token: "" });
    sessionStorage.removeItem("yt_token");
    sessionStorage.removeItem("yt_name");
    setIsSignedIn(false);
    setUserName("");
    setAnalytics(null);
    setRevenue(null);
  };

  const loadAnalyticsAPI = async () => {
    if (!window.gapi.client.youtubeAnalytics) {
      await window.gapi.client.load("youtubeAnalytics", "v2");
    }
  };

  const fetchMyAnalytics = async (): Promise<void> => {
    if (!isSignedIn) return alert("Please login first");
    setLoading(true);
    try {
      await loadAnalyticsAPI();
      const response = await window.gapi.client.youtubeAnalytics.reports.query({
        ids: "channel==MINE",
        startDate,
        endDate,
        metrics:
          "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained",
        dimensions: "day",
        sort: "day",
      });
      setAnalytics(response.result);
      console.log("Analytics response:", response);
    } catch (err) {
      console.error("Analytics fetch error", err);
      setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenue = async (): Promise<void> => {
    if (!isSignedIn) return alert("Please login first");
    setLoading(true);
    try {
      await loadAnalyticsAPI();
      const response = await window.gapi.client.youtubeAnalytics.reports.query({
        ids: "channel==MINE",
        startDate,
        endDate,
        metrics: "estimatedRevenue,estimatedAdRevenue,estimatedRedPartnerRevenue",
        dimensions: "month",
        sort: "month",
        currency: "USD",
      });
      setRevenue(response.result);
      console.log("Revenue response:", response);
    } catch (err) {
      console.error("Revenue fetch error", err);
      setError("Failed to fetch revenue");
    } finally {
      setLoading(false);
    }
  };

  // Fetch public channel stats
  const fetchPublicStats = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${id}&key=${API_KEY}`
      );
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const ch = data.items[0];
        setStats({
          title: ch.snippet.title,
          thumbnail: ch.snippet.thumbnails.high.url,
          subscribers: ch.statistics.subscriberCount,
          views: ch.statistics.viewCount,
          videos: ch.statistics.videoCount,
          description: ch.snippet.description,
        });
      } else {
        setError("Channel not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch channel stats");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (channelId.trim()) fetchPublicStats(channelId.trim());
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Ayoba YouTube Analytics Dashboard</h2>

      <div className="mb-6 flex flex-wrap gap-3 justify-center items-center">
        {!isSignedIn ? (
          <button
            onClick={authenticate}
            disabled={!gisLoaded || !gapiLoaded}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Login to your account
          </button>
        ) : (
          <>
            <span className="text-lg font-semibold">{userName}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {isSignedIn && (
        <div className="mb-6 flex flex-wrap gap-3 justify-center items-center">
          <label>
            From:{" "}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-1 rounded"
            />
          </label>
          <label>
            To:{" "}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-1 rounded"
            />
          </label>
          <button
            onClick={fetchMyAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Fetch Analytics
          </button>
          <button
            onClick={fetchRevenue}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Fetch Revenue
          </button>
        </div>
      )}

      {loading && <p className="text-center font-semibold">Loading...</p>}

      {analytics && (
        <div className="mb-6 border p-4 rounded shadow bg-white overflow-auto">
          <h3 className="font-bold text-xl mb-2">My Channel Analytics</h3>
          <p>Total Rows: {analytics.rows?.length || 0}</p>
          <pre className="text-sm max-h-60 overflow-auto">
            {JSON.stringify(analytics, null, 2)}
          </pre>
        </div>
      )}

      {revenue && (
        <div className="mb-6 border p-4 rounded shadow bg-white overflow-auto">
          <h3 className="font-bold text-xl mb-2">Revenue Overview</h3>
          <pre className="text-sm max-h-60 overflow-auto">
            {JSON.stringify(revenue, null, 2)}
          </pre>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap justify-center">
        <input
          type="text"
          placeholder="Enter public channel ID"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          className="border p-2 grow rounded max-w-xs"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Fetch Public Stats
        </button>
      </form>

      {stats && (
        <div className="border p-4 rounded shadow bg-white mb-6 flex flex-col items-center">
          <img src={stats.thumbnail} alt={stats.title} className="mb-2 rounded w-40 h-40 object-cover" />
          <h3 className="font-bold text-2xl">{stats.title}</h3>
          <p className="mb-1">Subscribers: {stats.subscribers}</p>
          <p className="mb-1">Views: {stats.views}</p>
          <p className="mb-1">Videos: {stats.videos}</p>
          {stats.description && <p className="mt-2 text-gray-700 text-center">{stats.description}</p>}
        </div>
      )}

      {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
    </div>
  );
};

export default YouTubeAnalytics;
