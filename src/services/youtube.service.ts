// src/services/youtube.service.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Format large numbers into human-readable format
 * (e.g. 1000 → 1K, 1500000 → 1.5M)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

/**
 * Convert YouTube ISO 8601 duration (e.g. "PT1H2M3S") into "1:02:03"
 */
export const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match?.[1] || "0");
  const minutes = parseInt(match?.[2] || "0");
  const seconds = parseInt(match?.[3] || "0");

  const parts = [hours, minutes, seconds].filter((v, i) => v || i > 0);
  return parts.map((v) => String(v).padStart(2, "0")).join(":");
};

/**
 * Compute start and end dates for analytics range
 */
export const getDateRange = (filter: "7d" | "30d" | "90d") => {
  const end = new Date();
  const start = new Date();
  const days = filter === "90d" ? 90 : filter === "30d" ? 30 : 7;
  start.setDate(end.getDate() - days);
  return { start, end };
};

/**
 * Generic YouTube API request
 */
export const fetchYouTubeData = async <T>(
  url: string,
  accessToken: string
): Promise<T> => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`YouTube API Error: ${res.statusText}`);
  return res.json();
};

/**
 * Parse analytics response for chart rendering
 */
export const parseAnalyticsData = (response: any) => {
  if (!response?.rows || !response?.columnHeaders) return [];

  const labels = response.rows.map((r: any) => r[0]);
  const metrics = response.columnHeaders
    .filter((header: any) => header.columnType === "METRIC")
    .map((header: any, i: number) => ({
      label: header.name,
      data: response.rows.map((r: any) => Number(r[i + 1])),
    }));

  return { labels, datasets: metrics };
};

/**
 * Fetch top performing videos
 */
export const fetchTopVideos = async (accessToken: string, maxResults = 10) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=${maxResults}`;
  const data = await fetchYouTubeData<any>(url, accessToken);
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.snippet?.title,
    views: Number(item.statistics?.viewCount || 0),
    likes: Number(item.statistics?.likeCount || 0),
    comments: Number(item.statistics?.commentCount || 0),
    publishedAt: item.snippet?.publishedAt,
  }));
};

export const fetchChannelAnalytics = async (
  accessToken: string,
  startDate: string,
  endDate: string,
  channelId: string
) => {
  const url = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${channelId}&startDate=${startDate}&endDate=${endDate}&metrics=views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost`;
  return fetchYouTubeData<any>(url, accessToken);
};
