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
export const getDateRange = (
  filter: "7d" | "30d" | "90d" | "6m" | "1y" | "2y" | "5y"
) => {
  const end = new Date();
  const start = new Date();

  switch (filter) {
    case "7d":
      start.setDate(end.getDate() - 7);
      break;
    case "30d":
      start.setDate(end.getDate() - 30);
      break;
    case "90d":
      start.setDate(end.getDate() - 90);
      break;
    case "6m":
      start.setMonth(end.getMonth() - 6);
      break;
    case "1y":
      start.setFullYear(end.getFullYear() - 1);
      break;
    case "2y":
      start.setFullYear(end.getFullYear() - 2);
      break;
    case "5y":
      start.setFullYear(end.getFullYear() - 5);
      break;
    default:
      start.setDate(end.getDate() - 30);
  }

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
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
 * Fetch videos for a channel with views & revenue included
 */
export const fetchChannelVideos = async (
  accessToken: string,
  channelId: string,
  maxResults = 20,
  analyticsStartDate?: string,
  analyticsEndDate?: string
) => {
  // Step 1: Get the upload playlist ID
  const channelData = await fetchYouTubeData<any>(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}`,
    accessToken
  );

  const uploadsPlaylistId =
    channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId)
    throw new Error("Uploads playlist not found for channel.");

  // Step 2: Fetch videos from the upload playlist
  const playlistData = await fetchYouTubeData<any>(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}`,
    accessToken
  );

  const videos = playlistData.items.map((item: any) => ({
    id: item.contentDetails.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.medium?.url,
    publishedAt: item.snippet.publishedAt,
    description: item.snippet.description,
    revenue: 0, // default
    views: 0, // default
  }));

  // Step 3: Fetch views for each video
  if (videos.length > 0) {
    const videoIds = videos.map((v) => v.id).join(",");
    const statsData = await fetchYouTubeData<any>(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`,
      accessToken
    );

    statsData.items.forEach((item: any) => {
      const video = videos.find((v) => v.id === item.id);
      if (video) video.views = Number(item.statistics.viewCount || 0);
    });
  }

  // Step 4: Fetch revenue for each video if analytics dates provided
  if (analyticsStartDate && analyticsEndDate) {
    for (const video of videos) {
      try {
        const response: any = await fetchYouTubeData<any>(
          `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=${analyticsStartDate}&endDate=${analyticsEndDate}&metrics=estimatedRevenue&dimensions=video&filters=video==${video.id}`,
          accessToken
        );
        const revenueValue = response.rows?.[0]?.[1] ?? 0;
        const revenueNumber =
          typeof revenueValue === "string"
            ? Number(revenueValue)
            : revenueValue;
        video.revenue = Number.isFinite(revenueNumber) ? revenueNumber : 0;
      } catch (err) {
        console.warn(`Failed to fetch revenue for video ${video.id}`, err);
      }
    }
  }

  return videos;
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

/**
 * Fetch channel-level analytics
 */
export const fetchChannelAnalytics = async (
  accessToken: string,
  startDate: string,
  endDate: string,
  channelId: string
) => {
  const url = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${channelId}&startDate=${startDate}&endDate=${endDate}&metrics=views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost`;
  return fetchYouTubeData<any>(url, accessToken);
};
