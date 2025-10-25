/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  const [analytics, setAnalytics] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [channelId, setChannelId] = useState("");
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load GAPI & GIS scripts
  useEffect(() => {
    const gapiScript = document.createElement("script");
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.async = true;
    gapiScript.onload = () => {
      window.gapi.load("client", async () => setGapiLoaded(true));
    };
    document.body.appendChild(gapiScript);

    const gisScript = document.createElement("script");
    gisScript.src = "https://accounts.google.com/gsi/client";
    gisScript.async = true;
    gisScript.onload = () => setGisLoaded(true);
    document.body.appendChild(gisScript);

    return () => {
      document.body.removeChild(gapiScript);
      document.body.removeChild(gisScript);
    };
  }, []);

  // OAuth login
  const authenticate = async (): Promise<void> => {
    if (!gisLoaded || !gapiLoaded) return alert("Scripts not loaded yet");

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (tokenResponse: any) => {
        if (tokenResponse.access_token) {
          window.gapi.client.setToken({ access_token: tokenResponse.access_token });
          setIsSignedIn(true);

          await window.gapi.client.load("youtubeAnalytics", "v2");
          console.log("YouTube Analytics API loaded");

          // Auto-fetch analytics and revenue
          fetchMyAnalytics();
          fetchRevenue();
        }
      },
    });

    tokenClient.requestAccessToken();
  };

  // Fetch analytics (day dimension)
  const fetchMyAnalytics = async (): Promise<void> => {
    if (!isSignedIn) return;
    try {
      const response = await window.gapi.client.youtubeAnalytics.reports.query({
        ids: "channel==MINE",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        metrics:
          "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained",
        dimensions: "day",
        sort: "day",
      });
      setAnalytics(response.result);
    } catch (err) {
      console.error("Analytics fetch error", err);
      setError("Failed to fetch analytics");
    }
  };

  // Fetch revenue (month dimension)
  const fetchRevenue = async (): Promise<void> => {
    if (!isSignedIn) return;

    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), 1); // first day of current month
    const startDate = new Date(endDate.getFullYear(), 0, 1); // Jan 1st of current year

    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-01`;

    try {
      const response = await window.gapi.client.youtubeAnalytics.reports.query({
        ids: "channel==MINE",
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        metrics: "estimatedRevenue,estimatedAdRevenue,estimatedRedPartnerRevenue",
        dimensions: "month",
        sort: "month",
        currency: "USD",
      });
      setRevenue(response.result);
    } catch (err) {
      console.error("Revenue fetch error", err);
      setError("Failed to fetch revenue");
    }
  };

  // Fetch public channel stats
  const fetchPublicStats = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${API_KEY}`
      );
      const data = await res.json();
      if (data.items?.length) {
        const ch = data.items[0];
        setStats({
          title: ch.snippet.title,
          thumbnail: ch.snippet.thumbnails.high.url,
          subscribers: ch.statistics.subscriberCount,
          views: ch.statistics.viewCount,
          videos: ch.statistics.videoCount,
          description: ch.snippet.description,
        });
      } else setError("Channel not found");
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
      <h2 className="text-3xl font-bold mb-6">YouTube Analytics Dashboard</h2>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={authenticate}
          disabled={!gisLoaded || !gapiLoaded}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Authorize & Load
        </button>
      </div>

      {analytics && (
        <div className="mb-6 border p-4 rounded shadow bg-white">
          <h3 className="font-bold text-xl mb-2">My Channel Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.rows?.map((r: any) => ({
              day: r[0],
              views: r[1],
              minutesWatched: r[2],
              avgViewDuration: r[3],
              avgViewPercentage: r[4],
              subscribersGained: r[5],
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#8884d8" />
              <Line type="monotone" dataKey="minutesWatched" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {revenue && (
        <div className="mb-6 border p-4 rounded shadow bg-white">
          <h3 className="font-bold text-xl mb-2">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenue.rows?.map((r: any) => ({
              month: r[0],
              estimatedRevenue: r[1],
              estimatedAdRevenue: r[2],
              estimatedRedPartnerRevenue: r[3],
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="estimatedRevenue" stroke="#ffc658" />
              <Line type="monotone" dataKey="estimatedAdRevenue" stroke="#ff8042" />
              <Line type="monotone" dataKey="estimatedRedPartnerRevenue" stroke="#0088FE" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Enter public channel ID"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          className="border p-2 grow rounded"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Fetch Public Stats
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {stats && (
        <div className="border p-4 rounded shadow bg-white mb-6">
          <img src={stats.thumbnail} alt={stats.title} className="mb-2 rounded" />
          <h3 className="font-bold text-2xl">{stats.title}</h3>
          <p className="mb-1">Subscribers: {stats.subscribers}</p>
          <p className="mb-1">Views: {stats.views}</p>
          <p className="mb-1">Videos: {stats.videos}</p>
          {stats.description && <p className="mt-2 text-gray-700">{stats.description}</p>}
        </div>
      )}
    </div>
  );
};

export default YouTubeAnalytics;
