import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";
import ScrollToTop from "./ScrollToTop";

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center pt-16">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="flex flex-1 flex-col">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
