import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Landing from "./pages/Landing.jsx";
import Search from "./pages/Search.jsx";
import Results from "./pages/Results.jsx";
import FlightDetail from "./pages/FlightDetail.jsx";
import Explore from "./pages/Explore.jsx";
import Methodology from "./pages/Methodology.jsx";

import IntelligenceLayout from "./pages/intelligence/IntelligenceLayout.jsx";
import Overview from "./pages/intelligence/Overview.jsx";
import IndexPage from "./pages/intelligence/IndexPage.jsx";
import RouteBasket from "./pages/intelligence/RouteBasket.jsx";
import DataQuality from "./pages/intelligence/DataQuality.jsx";
import Insights from "./pages/intelligence/Insights.jsx";
import Cpi from "./pages/intelligence/Cpi.jsx";
import Backtesting from "./pages/intelligence/Backtesting.jsx";
import Audit from "./pages/intelligence/Audit.jsx";
import Reports from "./pages/intelligence/Reports.jsx";
import ApiPortal from "./pages/intelligence/ApiPortal.jsx";

function TravelerShell({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 pt-40 pb-20 text-center">
      <div className="eyebrow mb-2">404</div>
      <h1 className="font-display text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-sm text-ink-mute dark:text-ink-darkMute">
        The page you're looking for doesn't exist in this prototype.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Traveler experience */}
      <Route path="/" element={<TravelerShell><Landing /></TravelerShell>} />
      <Route path="/search" element={<TravelerShell><Search /></TravelerShell>} />
      <Route path="/results" element={<TravelerShell><Results /></TravelerShell>} />
      <Route path="/flight/:id" element={<TravelerShell><FlightDetail /></TravelerShell>} />
      <Route path="/explore" element={<TravelerShell><Explore /></TravelerShell>} />
      <Route path="/methodology" element={<TravelerShell><Methodology /></TravelerShell>} />

      {/* Government / Intelligence experience */}
      <Route path="/intelligence" element={<IntelligenceLayout />}>
        <Route index element={<Overview />} />
        <Route path="index" element={<IndexPage />} />
        <Route path="routes" element={<RouteBasket />} />
        <Route path="data-quality" element={<DataQuality />} />
        <Route path="insights" element={<Insights />} />
        <Route path="cpi" element={<Cpi />} />
        <Route path="backtesting" element={<Backtesting />} />
        <Route path="audit" element={<Audit />} />
        <Route path="reports" element={<Reports />} />
        <Route path="api" element={<ApiPortal />} />
      </Route>

      <Route path="*" element={<TravelerShell><NotFound /></TravelerShell>} />
    </Routes>
  );
}
