import { Routes, Route, } from "react-router-dom";
import TermsOfService from "./components/TermsOfService";
import PrivacyPolicy from "./components/PrivacyPolicy";
import AdminLogin from "./pages/AdminLogin";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  // const location = useLocation();

  // Check if the current route starts with "/admin" (for possible admin layouts)
  // const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="">
      <div className="">
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<AdminLogin />} />

          {/* Auth/Policy Routes */}
          {/* <Route path="/forgetpass" element={<ForgetPassword />} /> */}
          {/* <Route path="/verification" element={<Verification />} /> */}
          {/* <Route path="/resetpass" element={<ResetPassword />} /> */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Other Routes */}
          {/* <Route path="/quiz/:projectId" element={<Quiz />} /> */}
          {/* <Route path="/result/:projectId/:userId" element={<Result />} /> */}
          {/* <Route path="/admin/*" element={<Dashboard />} /> */}
        </Routes>
      </div>

      {/* Optional Footer Display */}
      {/* {!isAdminRoute && <Footer />} */}
    </div>
  );
}

export default App;
