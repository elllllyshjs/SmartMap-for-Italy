import { useRef, useState, type ChangeEvent } from "react";
import { useItineraryStore } from "../../store/useItineraryStore";
import { exportItineraryToFile, readItineraryFromFile } from "../../lib/storage";
import Modal from "./Modal";

export type ViewMode = "map" | "itinerary";

interface Props {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function Header({ view, onViewChange }: Props) {
  const days = useItineraryStore((s) => s.days);
  const replaceAllDays = useItineraryStore((s) => s.replaceAllDays);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);

  function handleFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPendingImportFile(file);
    e.target.value = "";
  }

  async function confirmImport() {
    if (!pendingImportFile) return;
    try {
      const importedDays = await readItineraryFromFile(pendingImportFile);
      replaceAllDays(importedDays);
    } catch (err) {
      alert(err instanceof Error ? err.message : "导入失败");
    } finally {
      setPendingImportFile(null);
    }
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="text-lg">🇮🇹</span>
        <h1 className="text-base font-semibold text-gray-900">Smart Map for Italy</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-full bg-gray-100 p-1 text-sm">
          <button
            onClick={() => onViewChange("map")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              view === "map" ? "bg-white text-gray-900 shadow" : "text-gray-500"
            }`}
          >
            地图浏览
          </button>
          <button
            onClick={() => onViewChange("itinerary")}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              view === "itinerary" ? "bg-white text-gray-900 shadow" : "text-gray-500"
            }`}
          >
            行程规划
          </button>
        </div>

        <button
          onClick={() => exportItineraryToFile(days)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          导出行程
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          导入行程
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileSelected}
        />
      </div>

      <Modal
        open={!!pendingImportFile}
        title="导入行程"
        onClose={() => setPendingImportFile(null)}
        onConfirm={confirmImport}
        confirmLabel="导入并覆盖"
      >
        导入将覆盖当前的全部行程数据，确定继续吗？建议先点击"导出行程"备份。
      </Modal>
    </header>
  );
}
