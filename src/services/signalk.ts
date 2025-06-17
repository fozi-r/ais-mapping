// const SIGNALK_URL = "ws://localhost:3000/signalk/v1/stream";

// export function connectSignalK(callback: (data: any) => void) {
//     const ws = new WebSocket(SIGNALK_URL);

//     ws.onopen = () => console.log("Connected to Signal K");
//     ws.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         if (data.updates) {
//             callback(data);
//         }
//     };
//     ws.onerror = (error) => console.error("WebSocket error:", error);
//     ws.onclose = () => console.log("Disconnected from Signal K");

//     return ws; // Return so we can close it later if needed
// }
const requestedNames = new Set<string>();
const SIGNALK_URL = "ws://localhost:3000/signalk/v1/stream";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1hcmV4cHMiLCJpYXQiOjE3NDQxMzg0OTh9.s1iZy_EHn0v5p0M7JUOvG3Yib-yKSsNls8MvcwUxDko"

interface SubscriptionPath {
  context: string; // e.g. "vessels.self" or "vessels.*"
  subscribe: {
    path: string; // e.g. "navigation.position"
    period?: number; // optional, how often to get updates (ms)
    policy?: "ideal" | "fixed" | "instant"
  }[];
}

export function connectSignalK(
  callback: (data: any) => void,
  subscriptions?: SubscriptionPath[]
) {
  const ws = new WebSocket(SIGNALK_URL);

  ws.onopen = () => {
    console.log("Connected to Signal K");

    // Send subscription message if provided
    if (subscriptions && subscriptions.length > 0) {
      ws.send(
        JSON.stringify({
          context: "vessels.*", // general fallback context
          subscribe: subscriptions.flatMap((s) =>
            s.subscribe.map((sub) => ({
              //context: s.context,
              path: sub.path,
              period: sub.period ?? 5000,
              policy: sub.policy ?? "ideal"
            }))
          ),
        })
      );
    }
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // if (data.updates) {
    //   callback(data);
    // }
    if (data.updates && data.context?.startsWith("vessels.")) {
      const vesselId = data.context.replace(/^vessels\./, "");

      // Request name only once per vessel
      if (!requestedNames.has(vesselId)) {
        requestedNames.add(vesselId);

        ws.send(
          JSON.stringify({
            requestId: `name-${vesselId}`,
            context: `vessels.${vesselId}`,
            get: { path: "name" },
          })
        );
      }

      callback(data);
    }
    if (data.requestId?.startsWith("name-")) {
      callback(data); // optional: route through same callback
    }
  };

  ws.onerror = (error) => console.error("WebSocket error:", error);
  ws.onclose = () => console.log("Disconnected from Signal K");

  return ws;
}

export async function fetchVesselName(vesselId: string): Promise<string | null> {
  try {
    const res = await fetch(`http://localhost:3000/signalk/v1/api/vessels/${vesselId}/name`);
    if (!res.ok) return null;

    const json = await res.json();
    return json.value ?? null;
  } catch (err) {
    console.warn(`Failed to fetch name for ${vesselId}`, err);
    return null;
  }
}

