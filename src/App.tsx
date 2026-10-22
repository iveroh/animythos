import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./ui/Layout";

const HomePage = lazy(() => import("./pages/HomePage"));
const ComponentsPage = lazy(() => import("./pages/ComponentsPage"));
const ComponentPage = lazy(() => import("./pages/ComponentPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="components/:slug" element={<ComponentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
