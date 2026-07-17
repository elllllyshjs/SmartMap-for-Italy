import type { LatLng, RouteLeg } from "../types";

export interface RouteWaypoint {
  itemId: string;
  location: LatLng;
}

/**
 * 计算一天行程中各地点之间的步行路线与耗时。
 * directionsService 需要由调用方通过 useMapsLibrary("routes") 加载后传入。
 */
export async function computeDayRoute(
  directionsService: google.maps.DirectionsService,
  waypoints: RouteWaypoint[]
): Promise<RouteLeg[]> {
  if (waypoints.length < 2) return [];

  const origin = waypoints[0].location;
  const destination = waypoints[waypoints.length - 1].location;
  const intermediate = waypoints.slice(1, -1).map((w) => ({
    location: w.location,
    stopover: true,
  }));

  const result = await directionsService.route({
    origin,
    destination,
    waypoints: intermediate,
    travelMode: google.maps.TravelMode.WALKING,
    language: "zh-CN",
  });

  const legs = result.routes[0]?.legs ?? [];
  const routeLegs: RouteLeg[] = [];
  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    routeLegs.push({
      fromItemId: waypoints[i].itemId,
      toItemId: waypoints[i + 1].itemId,
      durationText: leg.duration?.text ?? "",
      distanceText: leg.distance?.text ?? "",
    });
  }
  return routeLegs;
}
