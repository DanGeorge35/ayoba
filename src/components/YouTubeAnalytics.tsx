/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CLIENT_ID =
  "943556130775-fbsgln3igbohm502mhhomn0e8q2895gj.apps.googleusercontent.com";

// API key for public stats
const API_KEY = "AIzaSyCKjx6yHE9L4RS-btVJsm2kxmuEtpciIbM";

const SCOPES = [
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

interface ChannelStats {
  title: string;
  thumbnail: string;
  subscribers: string;
  views: string;
  videos: string;
  description?: string;
}

interface Channel {
  id: string;
  title: string;
  thumbnail: string;
}

// --- API response payload interfaces ---
interface GapiChannelItem {
  id: string;
  snippet: {
    title: string;
    thumbnails?: {
      default?: { url: string };
      high?: { url: string };
    };
    description?: string;
  };
  contentDetails?: {
    relatedPlaylists?: {
      uploads?: string;
    };
  };
  statistics?: {
    subscriberCount?: string;
    viewCount?: string;
    videoCount?: string;
  };
}

interface YouTubeChannelsListResponse {
  result: {
    items: GapiChannelItem[];
  };
}

interface PlaylistItem {
  contentDetails: { videoId: string };
  snippet: {
    title: string;
    thumbnails?: { default?: { url: string } };
  };
}

interface PlaylistItemsListResponse {
  result: {
    items: PlaylistItem[];
    nextPageToken?: string;
  };
}

type AnalyticsRow = Array<string | number>;

interface YouTubeAnalyticsReportResponse {
  result: {
    rows?: AnalyticsRow[];
    columnHeaders?: Array<{ name: string; columnType?: string; dataType?: string }>;
  };
}

interface PublicChannelApiResponse {
  items?: Array<{
    snippet: {
      title: string;
      thumbnails?: { high?: { url: string } };
      description?: string;
    };
    statistics?: {
      subscriberCount?: string;
      viewCount?: string;
      videoCount?: string;
    };
  }>;
}

type RevenueReportType = 'channel' | 'contentOwner';

interface VideoRevenueItem {
  id: string;
  title: string;
  thumbnail: string;
  revenue: number;
}

const YouTubeAnalytics: React.FC = () => {
  const [gisLoaded, setGisLoaded] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [analytics, setAnalytics] = useState<YouTubeAnalyticsReportResponse['result'] | null>(null);
  const [revenue, setRevenue] = useState<YouTubeAnalyticsReportResponse['result'] | null>(null);
  const [channelId, setChannelId] = useState("");
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [revenueReportType, setRevenueReportType] = useState<RevenueReportType>('channel');
  const [analyticsStartDate, setAnalyticsStartDate] = useState<string>("");
  const [analyticsEndDate, setAnalyticsEndDate] = useState<string>("");
  const [revenueStartMonth, setRevenueStartMonth] = useState<string>("");
  const [revenueEndMonth, setRevenueEndMonth] = useState<string>("");
  const [videoRevenues, setVideoRevenues] = useState<VideoRevenueItem[]>([]);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);

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

  useEffect(() => {
    // Load stored login
    const token = localStorage.getItem("yt_token");
    const name = localStorage.getItem("yt_name");
    if (token && name) {
      window.gapi?.client.setToken({ access_token: token });
      setIsSignedIn(true);
      setUserName(name);
    }

    // Set default dates
    const today = new Date();
    const priorDate = new Date();
    priorDate.setMonth(priorDate.getMonth() - 2);
    
    // Analytics date range (last 2 months)
    setAnalyticsStartDate(priorDate.toISOString().slice(0, 10));
    setAnalyticsEndDate(today.toISOString().slice(0, 10));

    // Revenue months (first day of last month to first day of current month)
    const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    setRevenueStartMonth(firstDayLastMonth.toISOString().slice(0, 7));
    setRevenueEndMonth(firstDayThisMonth.toISOString().slice(0, 7));
  }, [gapiLoaded]);

  const fetchUserChannels = async () => {
    try {
      await window.gapi.client.load("youtube", "v3");
      const response: YouTubeChannelsListResponse = await window.gapi.client.youtube.channels.list({
        part: "snippet,contentOwnerDetails",
        mine: true,
        maxResults: 50
      });

      const channelList: Channel[] = response.result.items.map((item: GapiChannelItem) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.default?.url ?? ""
      }));
      
      setChannels(channelList);
    } catch (err) {
      console.error("Error fetching channels:", err);
      setError("Failed to fetch channels");
    }
  };

  const authenticate = async () => {
    if (!gisLoaded || !gapiLoaded) return alert("Google scripts not loaded yet");

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (tokenResponse: any) => {
        if (tokenResponse.access_token) {
          window.gapi.client.setToken({ access_token: tokenResponse.access_token });
          setIsSignedIn(true);
          localStorage.setItem("yt_token", tokenResponse.access_token);

          await window.gapi.client.load("youtubeAnalytics", "v2");
          await window.gapi.client.load("youtube", "v3");

          const userRes = await window.gapi.client.youtube.channels.list({
            part: "snippet",
            mine: true,
          });
          const name = userRes.result.items[0].snippet.title;
          setUserName(name);
          localStorage.setItem("yt_name", name);

          // Fetch user's channels after authentication
          await fetchUserChannels();
        }
      },
    });

    tokenClient.requestAccessToken();
  };

  const logout = () => {
    localStorage.removeItem("yt_token");
    localStorage.removeItem("yt_name");
    window.gapi.client.setToken({ access_token: "" });
    setIsSignedIn(false);
    setUserName("");
    setAnalytics(null);
    setRevenue(null);
  };

  const fetchMyAnalytics = async () => {
    if (!isSignedIn) return;
    setLoading(true);
    setError("");
    try {
      if (!window.gapi.client.youtubeAnalytics)
        await window.gapi.client.load("youtubeAnalytics", "v2");

      const res: YouTubeAnalyticsReportResponse = await window.gapi.client.youtubeAnalytics.reports.query({
        ids: "channel==MINE",
        startDate: analyticsStartDate,
        endDate: analyticsEndDate,
        metrics:
          "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained",
        dimensions: "day",
        sort: "day",
      });
      setAnalytics(res.result);
    } catch (err) {
      console.error("Analytics fetch error", err);
      setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

const fetchRevenue = async () => {
  if (!isSignedIn) return;
  setLoading(true);
  setError("");
  setRevenue(null);

  try {
    if (!window.gapi.client.youtubeAnalytics) {
      await window.gapi.client.load("youtubeAnalytics", "v2");
    }

    // Try channel-level revenue first (works for normal monetized channels)
    const startDate = `${revenueStartMonth}-01`;
    const endDate = `${revenueEndMonth}-01`;
    
    const res: YouTubeAnalyticsReportResponse = await window.gapi.client.youtubeAnalytics.reports.query({
      ids: revenueReportType === 'channel' ? "channel==MINE" : "contentOwner==MINE",
      startDate,
      endDate,
      metrics: "estimatedRevenue,estimatedAdRevenue,estimatedRedPartnerRevenue,grossRevenue",
      dimensions: "month",
      sort: "month",
      currency: "USD",
    });

    // Check if data exists
    if (!res.result || !res.result.rows || res.result.rows.length === 0) {
      setError(
        revenueReportType === 'channel'
          ? "Channel revenue data is unavailable. Your channel might not be monetized."
          : "Content owner revenue data is unavailable. You might not have content owner access."
      );
      return;
    }

    setRevenue(res.result);
  } catch (err: any) {
    console.error("Revenue fetch error", err);

    if (err.status === 404) {
      setError(
        revenueReportType === 'channel'
          ? "Revenue data not found. Please ensure your channel is monetized."
          : "Revenue data not found. Only YouTube Content Owners (MCNs) can access content owner reports."
      );
    } else if (err.result?.error?.errors?.some((e: any) => e.reason === "invalid")) {
      setError(
        `Revenue fetch failed: ${revenueReportType === 'channel' 
          ? 'channel-level metrics are not accessible' 
          : 'content owner-level metrics are not accessible'}`
      );
    } else {
      setError("Failed to fetch revenue data.");
    }
  } finally {
    setLoading(false);
  }
};


  const fetchPublicStats = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${API_KEY}`
      );
  const data: PublicChannelApiResponse = await res.json();
      if (data.items && data.items.length > 0) {
        const ch = data.items[0];
        setStats({
          title: ch.snippet.title,
          thumbnail: ch.snippet.thumbnails?.high?.url ?? "",
          subscribers: ch.statistics?.subscriberCount ?? "0",
          views: ch.statistics?.viewCount ?? "0",
          videos: ch.statistics?.videoCount ?? "0",
          description: ch.snippet.description ?? undefined,
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

  const fetchVideoRevenues = async () => {
    if (!isSignedIn) return;
    setIsFetchingVideos(true);
    setError("");
    setVideoRevenues([]);

    try {
      // 1. Get uploads playlist ID
      const channelResponse: YouTubeChannelsListResponse = await window.gapi.client.youtube.channels.list({
        mine: true,
        part: "contentDetails",
      });
      const uploadsPlaylistId =
        channelResponse.result.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        setError("Could not find your uploads playlist.");
        setIsFetchingVideos(false);
        return;
      }

      // 2. Get all video IDs from the playlist
      let nextPageToken: string | undefined = undefined;
      const allVideos: any[] = [];
      do {
        const playlistItemsResponse: PlaylistItemsListResponse = await window.gapi.client.youtube.playlistItems.list({
          playlistId: uploadsPlaylistId,
          part: "snippet,contentDetails",
          maxResults: 50,
          pageToken: nextPageToken,
        });

        const items = playlistItemsResponse.result.items || [];
        allVideos.push(...items);
        nextPageToken = playlistItemsResponse.result.nextPageToken || undefined;
      } while (nextPageToken);

      // 3. Fetch revenue for each video
      const videoRevenueData: VideoRevenueItem[] = [];
      for (const video of allVideos) {
        const videoId = video.contentDetails.videoId;
        const response: YouTubeAnalyticsReportResponse = await window.gapi.client.youtubeAnalytics.reports.query({
          ids: "channel==MINE",
          startDate: analyticsStartDate,
          endDate: analyticsEndDate,
          metrics: "estimatedRevenue",
          dimensions: "video",
          filters: `video==${videoId}`,
        });

        const revenueValue = response.result.rows?.[0]?.[1] ?? 0;
        const revenueNumber = typeof revenueValue === 'string' ? Number(revenueValue) : (revenueValue as number);

        videoRevenueData.push({
          id: videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails?.default?.url ?? "",
          revenue: Number.isFinite(revenueNumber) ? revenueNumber : 0,
        });
      }

      setVideoRevenues(videoRevenueData);
    } catch (err) {
      console.error("Error fetching video revenues:", err);
      setError("Failed to fetch video revenues.");
    } finally {
      setIsFetchingVideos(false);
    }
  };

  // Chart data
  const revenueChartData = revenue?.rows
    ? {
        labels: revenue.rows.map((row: any) => row[0]),
        datasets: [
          {
            label: "Estimated Total Revenue (USD)",
            data: revenue.rows.map((row: any) => parseFloat(row[1])),
            backgroundColor: "rgba(255, 206, 86, 0.5)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
          },
          {
            label: "Ad Revenue (USD)",
            data: revenue.rows.map((row: any) => parseFloat(row[2])),
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Red Partner Revenue (USD)",
            data: revenue.rows.map((row: any) => parseFloat(row[3])),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Gross Revenue (USD)",
            data: revenue.rows.map((row: any) => parseFloat(row[5])),
            backgroundColor: "rgba(153, 102, 255, 0.5)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          }
        ],
      }
    : null;

  const analyticsChartData = analytics?.rows
    ? {
        labels: analytics.rows.map((row: any) => row[0]),
        datasets: [
          {
            label: "Views",
            data: analytics.rows.map((row: any) => parseInt(row[1], 10)),
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
          },
          {
            label: "Subscribers Gained",
            data: analytics.rows.map((row: any) => parseInt(row[5], 10)),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      }
    : null;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        YouTube Analytics Dashboard
      </h2>

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
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Analytics Date Range</h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">From</label>
                <input
                  type="date"
                  value={analyticsStartDate}
                  onChange={(e) => setAnalyticsStartDate(e.target.value)}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">To</label>
                <input
                  type="date"
                  value={analyticsEndDate}
                  onChange={(e) => setAnalyticsEndDate(e.target.value)}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={fetchMyAnalytics}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-150"
              >
                Fetch Analytics
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue Period</h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Report Type</label>
                <select
                  value={revenueReportType}
                  onChange={(e) => setRevenueReportType(e.target.value as RevenueReportType)}
                  className="border p-2 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="channel">Channel Level</option>
                  <option value="contentOwner">Content Owner Level</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Start Month</label>
                <input
                  type="month"
                  value={revenueStartMonth}
                  onChange={(e) => setRevenueStartMonth(e.target.value)}
                  className="border p-2 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">End Month</label>
                <input
                  type="month"
                  value={revenueEndMonth}
                  onChange={(e) => setRevenueEndMonth(e.target.value)}
                  className="border p-2 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <button
                onClick={fetchRevenue}
                className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-150"
              >
                Fetch Revenue
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-center font-semibold">Loading...</p>}

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="lg:col-span-2">
          {!isSignedIn && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-center">
                Please sign in to view analytics and revenue data.
              </p>
            </div>
          )}
        </div>

        {analyticsChartData && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold text-xl mb-4 text-gray-800">Channel Performance</h3>
            <div className="aspect-4/3 w-full">
              <Line 
                data={analyticsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {revenue === null && isSignedIn ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-center">
              Revenue data is only available for YouTube content owners.
              Click "Fetch Revenue" to check if you have access.
            </p>
          </div>
        ) : revenueChartData ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold text-xl mb-4 text-gray-800">Revenue Overview</h3>
            <div className="aspect-4/3 w-full">
              <Bar 
                data={revenueChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value}`
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: $${context.raw}`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {isSignedIn && channels.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Your YouTube Channels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => {
                  setChannelId(channel.id);
                  fetchPublicStats(channel.id);
                }}
                className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={channel.thumbnail}
                    alt={channel.title}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 line-clamp-1">{channel.title}</h4>
                    <p className="text-sm text-gray-500">ID: {channel.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-4 flex gap-2 flex-wrap justify-center"
      >
        <div className="w-full max-w-xl">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Other Channel
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter public channel ID"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="border p-2 grow rounded"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 whitespace-nowrap"
            >
              Fetch Public Stats
            </button>
          </div>
        </div>
      </form>

      {stats && (
        <div className="border p-4 rounded shadow bg-white mb-6 flex flex-col items-center">
          <img
            src={stats.thumbnail}
            alt={stats.title}
            className="mb-2 rounded w-40 h-40 object-cover"
          />
          <h3 className="font-bold text-2xl">{stats.title}</h3>
          <p className="mb-1">Subscribers: {stats.subscribers}</p>
          <p className="mb-1">Views: {stats.views}</p>
          <p className="mb-1">Videos: {stats.videos}</p>
          {stats.description && (
            <p className="mt-2 text-gray-700 text-center">{stats.description}</p>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-center font-semibold">{error}</p>
      )}

      {isSignedIn && (
        <div className="mt-8">
          <div className="flex justify-center mb-4">
            <button
              onClick={fetchVideoRevenues}
              disabled={isFetchingVideos}
              className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 disabled:bg-gray-400"
            >
              {isFetchingVideos ? "Fetching Video Revenues..." : "Fetch Video Revenues"}
            </button>
          </div>

          {isFetchingVideos && <p className="text-center font-semibold">Loading video revenues...</p>}

          {videoRevenues.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Video Revenue Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Video
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estimated Revenue (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {videoRevenues.map((video) => (
                      <tr key={video.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={video.thumbnail} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{video.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${video.revenue.toFixed(2)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubeAnalytics;
