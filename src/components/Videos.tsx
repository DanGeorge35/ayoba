/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  youtubeAuthService,
  type ChannelToken,
} from "../services/youtubeAuth.service";
import { fetchChannelVideos } from "../services/youtube.service";
import yticon from "../assets/yticon.png";
import { ArrowRight, PlayCircle } from "lucide-react";

const Videos: React.FC = () => {
  const [channels, setChannels] = useState<ChannelToken[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChannelToken | null>(
    null
  );
  const [videos, setVideos] = useState<any[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    channelId: null as string | null,
    channelTitle: null as string | null,
  });

  // Load scripts and stored channels
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
    setChannels((prev) =>
      prev.filter((c) => c.channelId !== confirmModal.channelId)
    );
    if (selectedChannel?.channelId === confirmModal.channelId)
      setSelectedChannel(null);
    setConfirmModal({ show: false, channelId: null, channelTitle: null });
  };

  // Fetch videos for selected channel
  useEffect(() => {
    const loadVideos = async () => {
      if (!selectedChannel) {
        setVideos([]); // Clear videos when no channel selected
        return;
      }

      setVideos([]); // Clear old videos before fetching new ones
      setLoadingModal(true);
      try {
        const data = await fetchChannelVideos(
          selectedChannel.accessToken,
          selectedChannel.channelId
        );
        setVideos(data || []); // In case API returns null or undefined
      } catch (err) {
        console.error(err);
        setVideos([]); // Prevent stale state
      } finally {
        setLoadingModal(false);
      }
    };
    loadVideos();
  }, [selectedChannel]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Custom animation */}
      <style>
        {`
          @keyframes moveLeftRight {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(20px); }
          }
          .animate-move-left-right {
            animation: moveLeftRight 1.5s ease-in-out infinite;
          }
        `}
      </style>

      {/* --- Channel Selection --- */}
      <div className="max-full mx-auto mt-10 max-w-7xl">
        <div className="pb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative">
            {/* Left Section (Title + Icon) */}
            <div className="flex items-center gap-4">
              <img
                src={yticon}
                alt="YouTube"
                className="w-16 h-16 rounded-full border-4 border-red-500 shadow"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  YouTube Videos
                </h2>
                <p className="text-gray-500 text-sm">
                  Select a connected channel to view its videos.
                </p>
              </div>
            </div>

            {/* Animated Arrow in Center */}
            <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center text-red-600">
              <ArrowRight
                className="w-8 h-8 animate-move-left-right"
                strokeWidth={2.5}
              />
            </div>

            {/* Dropdown Section */}
            <div className="flex items-center gap-4 w-full md:w-1/3">
              <select
                className="flex-1 border-2 border-red-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={selectedChannel?.channelId || ""}
                onChange={(e) => {
                  const selected = channels.find(
                    (c) => c.channelId === e.target.value
                  );
                  setSelectedChannel(selected || null);
                }}
              >
                <option value="">-- Select a Channel --</option>
                {channels.map((channel) => (
                  <option key={channel.channelId} value={channel.channelId}>
                    {channel.channelTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- Videos Section --- */}
      {selectedChannel && (
        <div className="max-w-7xl mx-auto mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Videos from {selectedChannel.channelTitle}
          </h3>

          {!loadingModal && videos.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm">
              No videos found for this channel.
            </div>
          ) : (
            !loadingModal && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1 relative group"
                  >
                    {/* Thumbnail with overlay icon */}
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-44 object-cover"
                      />
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.youtube.com/watch?v=${video.id}`,
                            "_blank"
                          )
                        }
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition"
                      >
                        <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                      </button>
                    </div>

                    {/* Video details */}
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </p>

                      {video.revenue !== undefined && (
                        <p className="text-sm mt-2 text-green-600 font-medium">
                          Revenue: ${video.revenue.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* --- Confirmation Modal --- */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Remove Channel
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-medium text-red-600">
                {confirmModal.channelTitle}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  setConfirmModal({
                    show: false,
                    channelId: null,
                    channelTitle: null,
                  })
                }
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Loading Modal --- */}
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

export default Videos;
