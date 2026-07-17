import { useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import Header, { type ViewMode } from "./components/common/Header";
import MapPage from "./pages/MapPage";
import ItineraryPage from "./pages/ItineraryPage";

export default function App() {
  const [view, setView] = useState<ViewMode>("map");
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            还没有配置 Google Maps API Key
          </h2>
          <p className="text-sm text-gray-600">
            请参考项目根目录下的{" "}
            <code className="rounded bg-gray-100 px-1">SETUP_GOOGLE_API.md</code>{" "}
            完成申请，并将密钥填入{" "}
            <code className="rounded bg-gray-100 px-1">.env.local</code> 中的{" "}
            <code className="rounded bg-gray-100 px-1">VITE_GOOGLE_MAPS_API_KEY</code>
            ，然后重新启动开发服务器。
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["routes"]}>
      <div className="flex h-screen flex-col bg-gray-50">
        <Header view={view} onViewChange={setView} />
        <main className="min-h-0 flex-1">
          {view === "map" ? <MapPage /> : <ItineraryPage />}
        </main>
      </div>
    </APIProvider>
  );
}
