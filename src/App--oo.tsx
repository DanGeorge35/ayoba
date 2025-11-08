import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import YouTubeAnalytics from "./components/YouTubeAnalytics";
import TermsOfService from "./components/TermsOfService";
import PrivacyPolicy from "./components/PrivacyPolicy";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                Ayouba YouTube Analytics
              </Link>
            </div>
          </div>
        </nav>

        <main className="grow">
          <Routes>
            <Route path="/" element={<YouTubeAnalytics />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>

        <footer className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-gray-600">
              <p>© 2025 Ayoba. All rights reserved.</p>
              <div className="mt-2 space-x-4">
                <Link to="/terms" className="hover:text-gray-800">
                  Terms of Service
                </Link>
                <Link to="/privacy" className="hover:text-gray-800">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
