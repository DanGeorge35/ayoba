/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { youtubeAuthService, type ChannelToken } from "../services/youtubeAuth.service";
import { fetchChannelVideos } from "../services/youtube.service";
import yticon from "../assets/yticon.png";
import { ArrowRight, PlayCircle } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VideoAnalytics: React.FC = () => {
  const [channels, setChannels] = useState<ChannelToken[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChannelToken | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "6m" | "1y" | "2y" | "5y">("30d");
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    channelId: null as string | null,
    channelTitle: null as string | null,
  });

  // Load stored channels
  useEffect(() => {
    const init = async () => {
      await youtubeAuthService.loadScripts();
      const saved = youtubeAuthService.getStoredChannels();
      setChannels(saved);
      if (saved.length > 0) setSelectedChannel(saved[0]);
    };
    init();
  }, []);

  // Remove channel
  const handleRemove = () => {
    if (!confirmModal.channelId) return;
    youtubeAuthService.removeChannel(confirmModal.channelId);
    setChannels(prev => prev.filter(c => c.channelId !== confirmModal.channelId));
    if (selectedChannel?.channelId === confirmModal.channelId) setSelectedChannel(null);
    setConfirmModal({ show: false, channelId: null, channelTitle: null });
  };

  // Compute date range
  const getDateRange = (filter: typeof dateRange) => {
    const end = new Date();
    const start = new Date();

    switch (filter) {
      case "7d": start.setDate(end.getDate() - 7); break;
      case "30d": start.setDate(end.getDate() - 30); break;
      case "90d": start.setDate(end.getDate() - 90); break;
      case "6m": start.setMonth(end.getMonth() - 6); break;
      case "1y": start.setFullYear(end.getFullYear() - 1); break;
      case "2y": start.setFullYear(end.getFullYear() - 2); break;
      case "5y": start.setFullYear(end.getFullYear() - 5); break;
      default: start.setDate(end.getDate() - 30);
    }

    return { start: start.toISOString().split("T")[0], end: end.toISOString().split("T")[0] };
  };

  // Fetch videos + analytics
  useEffect(() => {
    const loadVideos = async () => {
      if (!selectedChannel) {
        setVideos([]);
        return;
      }

      setVideos([]);
      setLoadingModal(true);
      try {
        const { start, end } = getDateRange(dateRange);

        const data = await fetchChannelVideos(
          selectedChannel.accessToken,
          selectedChannel.channelId,
          20,
          start,
          end
        );

        setVideos(data || []);
      } catch (err) {
        console.error(err);
        setVideos([]);
      } finally {
        setLoadingModal(false);
      }
    };
    loadVideos();
  }, [selectedChannel, dateRange]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Channel & Date Selection */}
      <div className="max-full mx-auto mt-10 max-w-7xl">
        <div className="pb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={yticon} alt="YouTube" className="w-16 h-16 rounded-full border-4 border-red-500 shadow" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">YouTube Video Analytics</h2>
              <p className="text-gray-500 text-sm">Select a channel and date range to view analytics.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              className="border-2 border-red-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedChannel?.channelId || ""}
              onChange={e => {
                const selected = channels.find(c => c.channelId === e.target.value);
                setSelectedChannel(selected || null);
              }}
            >
              <option value="">-- Select a Channel --</option>
              {channels.map(channel => (
                <option key={channel.channelId} value={channel.channelId}>{channel.channelTitle}</option>
              ))}
            </select>

            <select
              className="border-2 border-red-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              value={dateRange}
              onChange={e => setDateRange(e.target.value as any)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last 1 Year</option>
              <option value="2y">Last 2 Years</option>
              <option value="5y">Last 5 Years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video Analytics Grid */}
      {selectedChannel && (
        <div className="max-w-7xl mx-auto mt-10">
          {!loadingModal && videos.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm">
              No videos found for this channel.
            </div>
          ) : (
            !loadingModal && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {videos.map((video, index) => {
                  const chartData = {
                    labels: ["Views", "Revenue ($)"],
                    datasets: [{
                      label: video.title,
                      data: [video.views ?? 0, video.revenue ?? 0],
                      backgroundColor: ["rgba(59, 130, 246, 0.7)", "rgba(34, 197, 94, 0.7)"],
                    }],
                  };

                  return (
                    <div
                      key={video.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden p-4 hover:shadow-lg transition transform hover:-translate-y-1 relative group"
                    >
                      {/* Thumbnail */}
                      <div className="relative mb-4">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-44 object-cover rounded-md" />
                        <button
                          onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition"
                        >
                          <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                        </button>
                      </div>

                      {/* Chart */}
                      <Bar data={chartData} options={{
                        responsive: true,
                        plugins: { legend: { display: false }, title: { display: true } },
                        scales: { y: { beginAtZero: true } },
                      }} className="mb-2" />

                      <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mt-2">{video.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{new Date(video.publishedAt).toLocaleDateString()}</p>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      )}

      {/* Loading Modal */}
      {loadingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-72 text-center shadow-lg">
            <div className="animate-spin border-4 border-red-600 border-t-transparent rounded-full w-10 h-10 mx-auto mb-4"></div>
            <h2 className="text-gray-700 font-medium">Loading videos...</h2>
            <p className="text-sm text-gray-500 mt-1">Please wait a moment.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAnalytics;
