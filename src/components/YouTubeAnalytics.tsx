/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

const CLIENT_ID = "943556130775-fbsgln3igbohm502mhhomn0e8c2895gj.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/yt-analytics.readonly";

declare global {
  interface Window {
    gapi: any;
  }
}

const YouTubeAnalytics: React.FC = () => {
  const [gapiLoaded, setGapiLoaded] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  // Load GAPI script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.onload = () => {
      window.gapi.load("client:auth2", async () => {
        try {
          await window.gapi.auth2.init({ client_id: CLIENT_ID });
          setGapiLoaded(true);
        } catch (err) {
          console.error("Error initializing GAPI auth", err);
        }
      });
    };
    document.body.appendChild(script);

    // Cleanup script if component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const authenticate = async (): Promise<void> => {
    if (!gapiLoaded) {
      alert("GAPI not loaded yet");
      return;
    }

    try {
      const GoogleAuth = window.gapi.auth2.getAuthInstance();
      await GoogleAuth.signIn({ scope: SCOPES });
      setIsSignedIn(true);
      console.log("Sign-in successful");
    } catch (err) {
      console.error("Error signing in", err);
    }
  };

  const loadClient = async (): Promise<void> => {
    if (!gapiLoaded) {
      alert("GAPI not loaded yet");
      return;
    }

    try {
      await window.gapi.client.load(
        "https://youtubeanalytics.googleapis.com/$discovery/rest?version=v2"
      );
      console.log("GAPI client loaded for API");
    } catch (err) {
      console.error("Error loading GAPI client for API", err);
    }
  };

  const execute = async (): Promise<void> => {
    if (!isSignedIn) {
      alert("Please authenticate first");
      return;
    }

    try {
      const response = await window.gapi.client.youtubeAnalytics.reports.query({
        ids: "channel==MINE",
        startDate: "2017-01-01",
        endDate: "2017-12-31",
        metrics: "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained",
        dimensions: "day",
        sort: "day",
      });
      console.log("Response", response);
    } catch (err) {
      console.error("Execute error", err);
    }
  };

  return (
    <div>
      <button onClick={() => authenticate().then(loadClient)}>
        Authorize & Load
      </button>
      <button onClick={execute} disabled={!isSignedIn}>
        Execute
      </button>
    </div>
  );
};

export default YouTubeAnalytics;
