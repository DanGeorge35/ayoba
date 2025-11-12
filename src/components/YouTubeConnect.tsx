/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { youtubeAuthService, type ChannelToken } from "../services/youtubeAuth.service";
import { fetchChannelAnalytics, getDateRange } from "../services/youtube.service";
import yticon from "../assets/yticon.png";

const YouTubeConnect: React.FC = () => {
  const [channels, setChannels] = useState<ChannelToken[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChannelToken | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Modal States
  const [loadingModal, setLoadingModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    channelId: string | null;
    channelTitle: string | null;
  }>({ show: false, channelId: null, channelTitle: null });

  // Load scripts and existing channels on mount
  useEffect(() => {
    const init = async () => {
      await youtubeAuthService.loadScripts();
      const saved = youtubeAuthService.getStoredChannels();
      setChannels(saved);
      if (saved.length > 0) setSelectedChannel(saved[0]);

      // Check if redirected from Google with code
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (code) {
        setLoadingModal(true);
        try {
          const channel = await youtubeAuthService.exchangeCodeForTokens(code);
          if (channel) {
            setChannels((prev) => [...prev, channel]);
            setSelectedChannel(channel);
          }
          // Remove code from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error("Failed to authenticate channel:", err);
          alert("Failed to connect channel. Please try again.");
        } finally {
          setLoadingModal(false);
        }
      }
    };
    init();
  }, []);

  // Connect new channel
const handleConnect = async () => {
  try {
    setLoadingModal(true);
    const channel = await youtubeAuthService.authenticateChannel();
    if (channel) {
      setChannels((prev) => [...prev, channel]);
      if (!selectedChannel) setSelectedChannel(channel);
    }
  } catch (err) {
    console.error(err);
    alert("Authentication failed. Please try again.");
  } finally {
    setLoadingModal(false);
  }
};
  // Confirm remove channel
  const confirmRemove = (channelId: string, channelTitle: string) => {
    setConfirmModal({ show: true, channelId, channelTitle });
  };

  // Remove channel
  const handleRemove = () => {
    if (!confirmModal.channelId) return;
    youtubeAuthService.removeChannel(confirmModal.channelId);
    setChannels((prev) => prev.filter((c) => c.channelId !== confirmModal.channelId));
    if (selectedChannel?.channelId === confirmModal.channelId) setSelectedChannel(null);
    setConfirmModal({ show: false, channelId: null, channelTitle: null });
  };

  // Fetch analytics for selected channel
  useEffect(() => {
    const loadData = async () => {
      if (!selectedChannel) return;
      const { start, end } = getDateRange("30d");
      const data = await fetchChannelAnalytics(
        selectedChannel.accessToken,
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0],
        selectedChannel.channelId
      );
      setAnalytics(data);
    };
    loadData();
  }, [selectedChannel]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen relative">
      {/* Grid for Channel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {/* Connect New Channel */}
        <div className="rounded-2xl p-4 sm:p-6 bg-white flex flex-col items-center justify-center shadow-md h-72 sm:h-80 w-full max-w-xs sm:max-w-sm border border-red-500 hover:shadow-lg transition-shadow duration-200 mx-auto">
          <img
            src={yticon}
            alt="YouTube"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover bg-white mb-4 sm:mb-10 shadow-md"
          />
          <h2 className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-10 text-center">
            Connect Your YouTube Channel
          </h2>
          <button
            onClick={handleConnect}
            className="px-4 sm:px-5 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium text-xs sm:text-sm transition-colors duration-200"
          >
            + Connect Channel
          </button>
        </div>

        {/* Connected Channels */}
        {channels.map((c) => (
          <div
            key={c.channelId}
            className="rounded-2xl p-4 sm:p-6 bg-white flex flex-col items-center justify-center shadow-md h-72 sm:h-80 w-full max-w-xs sm:max-w-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 mx-auto"
          >
            <img
              src={c.thumbnail || yticon}
              alt={c.channelTitle}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-red-600 object-cover bg-white mb-4 sm:mb-10 shadow-md"
            />
            <h2 className="text-sm sm:text-base text-gray-700 font-medium mb-4 sm:mb-6 text-center">
              {c.channelTitle}
            </h2>
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => confirmRemove(c.channelId, c.channelTitle)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-red-500 hover:text-red-700 font-semibold transition-colors duration-200"
              >
                ✕ Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Confirmation Modal --- */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-[#000000c8] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-85 text-center shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Remove Channel</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-medium text-red-600">{confirmModal.channelTitle}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  setConfirmModal({ show: false, channelId: null, channelTitle: null })
                }
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Loading Modal --- */}
      {loadingModal && (
        <div className="fixed inset-0 bg-[#140505da] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-72 text-center shadow-lg">
            <div className="animate-spin border-4 border-red-600 border-t-transparent rounded-full w-10 h-10 mx-auto mb-4"></div>
            <h2 className="text-gray-700 font-medium">Adding Channel ...</h2>
            <p className="text-sm text-gray-500 mt-1">Please wait a moment.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeConnect;
