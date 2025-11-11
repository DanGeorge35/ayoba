/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { youtubeAuthService, type ChannelToken } from "../services/youtubeAuth.service";
import { fetchChannelAnalytics, formatNumber, getDateRange } from "../services/youtube.service";

const YouTubeConnect: React.FC = () => {
  const [channels, setChannels] = useState<ChannelToken[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChannelToken | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Load scripts and existing channels on mount
  useEffect(() => {
    const init = async () => {
      await youtubeAuthService.loadScripts();
      const saved = youtubeAuthService.getStoredChannels();
      setChannels(saved);
      if (saved.length > 0) setSelectedChannel(saved[0]);
    };
    init();
  }, []);

  // Connect new channel
  const handleConnect = async () => {
    const channel = await youtubeAuthService.authenticateChannel();
    if (channel) {
      setChannels((prev) => [...prev, channel]);
      if (!selectedChannel) setSelectedChannel(channel);
    }
  };

  // Remove channel
  const handleRemove = (channelId: string) => {
    youtubeAuthService.removeChannel(channelId);
    setChannels((prev) => prev.filter((c) => c.channelId !== channelId));
    if (selectedChannel?.channelId === channelId) setSelectedChannel(null);
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
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">YouTube Analytics</h2>

      {/* Channel List */}
      <div className="flex flex-wrap gap-4 mb-4">
        {channels.map((c) => (
          <div key={c.channelId} className="flex items-center gap-2">
            <button
              onClick={() => setSelectedChannel(c)}
              className={`px-4 py-2 rounded-md border ${
                selectedChannel?.channelId === c.channelId
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {c.channelTitle}
            </button>
            <button
              onClick={() => handleRemove(c.channelId)}
              className="text-red-500 text-sm"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={handleConnect}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          + Connect Channel
        </button>
      </div>

      {/* Selected Channel Analytics */}
      {selectedChannel && analytics ? (
        <div>
          <h3 className="text-lg font-medium mb-2">{selectedChannel.channelTitle}</h3>
          <p>Views: {formatNumber(analytics.rows?.[0]?.[1] || 0)}</p>
          <p>Watch Time: {formatNumber(analytics.rows?.[0]?.[2] || 0)} mins</p>
          <p>Subscribers: {formatNumber(analytics.rows?.[0]?.[3] || 0)}</p>
        </div>
      ) : (
        <p>No channel selected.</p>
      )}
    </div>
  );
};

export default YouTubeConnect;
