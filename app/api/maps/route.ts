import { NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({ type: z.enum(["hospital", "pharmacy", "police", "blood_bank"]).default("hospital"), lat: z.coerce.number().min(-90).max(90).optional(), lng: z.coerce.number().min(-180).max(180).optional(), location: z.string().trim().max(250).optional() });
const terms = { hospital: "hospital", pharmacy: "pharmacy", police: "police station", blood_bank: "blood bank" } as const;

export async function GET(request: Request) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Maps search is not configured yet. Add GOOGLE_MAPS_API_KEY." }, { status: 503 });
  const raw = Object.fromEntries(new URL(request.url).searchParams); const parsed = querySchema.safeParse(raw);
  if (!parsed.success || (!parsed.data.location && (parsed.data.lat === undefined || parsed.data.lng === undefined))) return NextResponse.json({ error: "Provide a location or coordinates." }, { status: 400 });
  try {
    let { lat, lng } = parsed.data;
    if (lat === undefined || lng === undefined) {
      const geocode = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(parsed.data.location!)}&key=${encodeURIComponent(apiKey)}`, { signal: AbortSignal.timeout(10_000) });
      const data = await geocode.json() as { status: string; results?: Array<{ geometry: { location: { lat: number; lng: number } } }> };
      if (data.status !== "OK" || !data.results?.[0]) return NextResponse.json({ error: "That location could not be found." }, { status: 404 });
      ({ lat, lng } = data.results[0].geometry.location);
    }
    const places = await fetch("https://places.googleapis.com/v1/places:searchNearby", { method: "POST", headers: { "Content-Type": "application/json", "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.internationalPhoneNumber,places.primaryType" }, body: JSON.stringify({ includedTypes: [terms[parsed.data.type]], maxResultCount: 8, locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius: 8000 } } }), signal: AbortSignal.timeout(12_000) });
    if (!places.ok) throw new Error("PLACES_FAILED");
    const data = await places.json() as { places?: Array<{ displayName?: { text: string }; formattedAddress?: string; location?: { latitude: number; longitude: number }; googleMapsUri?: string; internationalPhoneNumber?: string }> };
    return NextResponse.json({ center: { lat, lng }, places: (data.places ?? []).map((place) => ({ name: place.displayName?.text ?? "Emergency service", address: place.formattedAddress, phone: place.internationalPhoneNumber, mapsUrl: place.googleMapsUri, location: place.location ? { lat: place.location.latitude, lng: place.location.longitude } : undefined })) });
  } catch (error) { console.error("Maps error", error); return NextResponse.json({ error: "Unable to find nearby services right now." }, { status: 502 }); }
}
