import type { ItineraryDay } from "../types";

const EXPORT_FILENAME = "smart-map-italy-itinerary.json";

/** 行程数据本身通过 zustand persist 自动存入 localStorage，这里只负责导出/导入备份文件 */
export function exportItineraryToFile(days: ItineraryDay[]): void {
  const blob = new Blob([JSON.stringify(days, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = EXPORT_FILENAME;
  link.click();
  URL.revokeObjectURL(url);
}

export function readItineraryFromFile(file: File): Promise<ItineraryDay[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as ItineraryDay[];
        resolve(data);
      } catch {
        reject(new Error("行程文件格式不正确"));
      }
    };
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsText(file);
  });
}
