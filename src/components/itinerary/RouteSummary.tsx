import { useEffect, useMemo, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import type { ItineraryDay, RouteLeg } from "../../types";
import { computeDayRoute } from "../../lib/directionsService";

interface Props {
  day: ItineraryDay;
}

function parseDurationMinutes(text: string): number {
  // Google 中文返回形如 "15 分钟" / "1 小时 5 分钟"
  const hourMatch = text.match(/(\d+)\s*小时/);
  const minMatch = text.match(/(\d+)\s*分钟/);
  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const mins = minMatch ? parseInt(minMatch[1], 10) : 0;
  return hours * 60 + mins;
}

export default function RouteSummary({ day }: Props) {
  const routesLibrary = useMapsLibrary("routes");
  const [legs, setLegs] = useState<RouteLeg[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 只在这一天的地点组成（id + 顺序）真正变化时才重新计算路线，
  // 避免因为其他天拖拽导致 store 更新而触发多余的 Directions API 调用
  const itemsKey = useMemo(
    () => day.items.map((i) => i.id).join("|"),
    [day.items]
  );

  useEffect(() => {
    if (!routesLibrary || day.items.length < 2) {
      setLegs([]);
      return;
    }

    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const directionsService = new routesLibrary!.DirectionsService();
        const waypoints = day.items.map((item) => ({
          itemId: item.id,
          location: item.place.location,
        }));
        const result = await computeDayRoute(directionsService, waypoints);
        if (!cancelled) setLegs(result);
      } catch {
        if (!cancelled) setError("路线计算失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routesLibrary, itemsKey]);

  if (day.items.length < 2) return null;

  const totalMinutes = legs.reduce((sum, l) => sum + parseDurationMinutes(l.durationText), 0);

  return (
    <div className="border-t border-gray-100 p-3 text-xs text-gray-500">
      {loading && <p>路线计算中...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && legs.length > 0 && (
        <ul className="space-y-1">
          {legs.map((leg, idx) => (
            <li key={`${leg.fromItemId}-${leg.toItemId}`}>
              第{idx + 1}站 → 第{idx + 2}站：步行 {leg.durationText}（{leg.distanceText}）
            </li>
          ))}
          <li className="pt-1 font-medium text-gray-600">
            全程步行约 {totalMinutes} 分钟
          </li>
        </ul>
      )}
    </div>
  );
}
