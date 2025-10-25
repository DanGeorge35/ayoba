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
  const [userName, setUserName] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [channelId, setChannelId] = useState("");
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 2))
      .toISOString()
      .slice(0, 10)
  );
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));

  // Load GAPI and GIS scripts
  useEffect(() => {
    const gapiScript = document.createElement("script");
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.async = true;
    gapiScript.onload = () => window.gapi.load("client", async () => setGapiLoaded(true));
    document.body.appendChild(gapiScript);

    const gisScript = document.createElement("script");
    gisScript.src = "https://accounts.google.com/gsi/client";
    gisScript.async = true;
    gisScript.onload = () => setGisLoaded(true);
    document.body.appendChild(gisScript);

    // Restore login state
    const storedToken = localStorage.getItem("yt_access_token");
    const storedName = localStorage.getItem("yt_user_name");
    if (storedToken && storedName) {
      window.gapi?.client.setToken({ access_token: storedToken });
      setIsSignedIn(true);
      setUserName(storedName);
      if (gapiLoaded) {
        fetchMyAnalytics();
        fetchRevenue();
      }
    }

    return () => {
      document.body.removeChild(gapiScript);
      document.body.removeChild(gisScript);
    };
  }, [gapiLoaded]);

  // OAuth login
  const authenticate = async (): Promise<void> => {
    if (!gisLoaded || !gapiLoaded) return alert("Google scripts not loaded yet");

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (tokenResponse: any) => {
        if (tokenResponse.access_token) {
          window.gapi.client.setToken({ access_token: tokenResponse.access_token });
          setIsSignedIn(true);

          const meRes = await window.gapi.client.youtube.channels.list({
            part: "snippet",
            mine: true,
          });
          const name = meRes.result.items[0].snippet.title;
          setUserName(name);

          localStorage.setItem("yt_access_token", tokenResponse.access_token);
          localStorage.setItem("yt_user_name", name);

          await window.gapi.client.load("youtubeAnalytics", "v2");

          fetchMyAnalytics();
          fetchRevenue();
        }
      },
    });

    tokenClient.requestAccessToken();
  };

  const logout = () => {
    window.gapi.client.setToken(null);
    setIsSignedIn(false);
    setUserName(null);
    setAnalytics(null);
    setRevenue(null);
    localStorage.removeItem("yt_access_token");
    localStorage.removeItem("yt_user_name");
  };

  const fetchMyAnalytics = async (): Promise<void> => {
    if (!isSignedIn) return alert("Please authenticate first");
    setLoading(true);
    setError("");
    try {
      const response = await window.gapi.client.youtubeAnalytics.reports.query({
        ids: "channel==MINE",
        startDate: fromDate,
        endDate: toDate,
        metrics: "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained",
        dimensions: "day",
        sort: "day",
      });
      setAnalytics(response.result);
    } catch (err) {
      console.error("Analytics fetch error", err);
      setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenue = async (): Promise<void> => {
    if (!isSignedIn) return alert("Please authenticate first");
    setLoading(true);
    setError("");
    try {
      const response = await window.gapi.client.youtubeAnalytics.reports.query({
        ids: "channel==MINE",
        startDate: fromDate,
        endDate: toDate,
        metrics: "estimatedRevenue,estimatedAdRevenue,estimatedRedPartnerRevenue",
        dimensions: "month",
        sort: "month",
        currency: "USD",
      });
      setRevenue(response.result);
    } catch (err) {
      console.error("Revenue fetch error", err);
      setError("Failed to fetch revenue");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {!isSignedIn ? (
          <button
            onClick={authenticate}
            disabled={!gisLoaded || !gapiLoaded}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
          >
            Login to your account
          </button>
        ) : (
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full sm:w-auto"
          >
            Logout ({userName})
          </button>
        )}
      </div>

      {isSignedIn && (
        <div className="mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />

          <button
            onClick={fetchMyAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            Fetch Analytics
          </button>
          <button
            onClick={fetchRevenue}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 w-full sm:w-auto"
          >
            Fetch Revenue
          </button>
        </div>
      )}

      {loading && <p className="text-blue-500 font-bold mb-4 text-center">Loading...</p>}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

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

      <form onSubmit={handleSubmit} className="mb-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Enter public channel ID"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          className="border p-2 grow rounded"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full sm:w-auto"
        >
          Fetch Public Stats
        </button>
      </form>

      {stats && (
        <div className="border p-4 rounded shadow bg-white mb-6">
          <img
            src={stats.thumbnail}
            alt={stats.title}
            className="mb-2 rounded w-full max-w-xs mx-auto"
          />
          <h3 className="font-bold text-2xl text-center">{stats.title}</h3>
          <p className="mb-1 text-center">Subscribers: {stats.subscribers}</p>
          <p className="mb-1 text-center">Views: {stats.views}</p>
          <p className="mb-1 text-center">Videos: {stats.videos}</p>
          {stats.description && (
            <p className="mt-2 text-gray-700 text-center">{stats.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubeAnalytics;
