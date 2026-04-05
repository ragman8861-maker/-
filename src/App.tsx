import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Suspense, lazy } from "react";

// Lazy load pages for performance
const PuppyList = lazy(() => import("./pages/PuppyList"));
const PuppyDetail = lazy(() => import("./pages/PuppyDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const Process = lazy(() => import("./pages/Process"));
const Location = lazy(() => import("./pages/Location"));
const ReviewPage = lazy(() => import("./pages/ReviewList"));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white selection:bg-amber-100 selection:text-amber-900">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/puppies" element={<PuppyList />} />
              <Route path="/puppies/:id" element={<PuppyDetail />} />
              <Route path="/reviews" element={<ReviewPage />} />
              <Route path="/process" element={<Process />} />
              <Route path="/location" element={<Location />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
