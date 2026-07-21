"use client";

import { useState, type FormEvent } from "react";
import { Download, ImagePlus, LoaderCircle, MapPin, Navigation } from "lucide-react";

type Place = { name: string; address?: string; phone?: string; mapsUrl?: string };

export function EmergencyTools({ sessionId, location }: { sessionId: string; location?: string }) {
  const [imageUrl, setImageUrl] = useState(""); const [imageResult, setImageResult] = useState<{ injuryType: string; severity: string; recommendations: string[] } | null>(null); const [places, setPlaces] = useState<Place[]>([]); const [type, setType] = useState("hospital"); const [loadingImage, setLoadingImage] = useState(false); const [loadingPlaces, setLoadingPlaces] = useState(false); const [downloading, setDownloading] = useState(false); const [error, setError] = useState("");
  async function analyze(event: FormEvent) { event.preventDefault(); if (!imageUrl) return; setLoadingImage(true); setError(""); try { const response = await fetch("/api/analyze-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, imageUrl }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); setImageResult(result.analysis); } catch (caught) { setError(caught instanceof Error ? caught.message : "Image analysis failed."); } finally { setLoadingImage(false); } }
  async function findServices() { setLoadingPlaces(true); setError(""); try { let query = `type=${type}`; if (navigator.geolocation) { const position = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })); query += `&lat=${position.coords.latitude}&lng=${position.coords.longitude}`; } else if (location) query += `&location=${encodeURIComponent(location)}`; else throw new Error("Enable location access or add a location when creating the session."); const response = await fetch(`/api/maps?${query}`); const result = await response.json(); if (!response.ok) throw new Error(result.error); setPlaces(result.places); } catch (caught) { setError(caught instanceof Error ? caught.message : "Nearby services could not be found."); } finally { setLoadingPlaces(false); } }
  async function downloadReport() { setDownloading(true); setError(""); try { const response = await fetch("/api/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId }) }); if (!response.ok) { const result = await response.json(); throw new Error(result.error); } const href = URL.createObjectURL(await response.blob()); const link = document.createElement("a"); link.href = href; link.download = "rakshai-emergency-report.pdf"; link.click(); URL.revokeObjectURL(href); } catch (caught) { setError(caught instanceof Error ? caught.message : "Report could not be created."); } finally { setDownloading(false); } }
  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-3">
      {/* Nearby Services Card */}
      <div className="flex h-[300px] flex-col rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-navy">
          <MapPin className="h-5 w-5 text-safety" />
          Nearby services
        </div>
        <div className="mt-4 flex gap-2">
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="focus-ring min-w-0 flex-1 rounded-lg border px-2 text-sm"
          >
            <option value="hospital">Hospitals</option>
            <option value="pharmacy">Pharmacies</option>
            <option value="police">Police</option>
            <option value="blood_bank">Blood banks</option>
          </select>
          <button
            onClick={findServices}
            disabled={loadingPlaces}
            className="focus-ring rounded-lg bg-navy p-2.5 text-white disabled:opacity-60"
          >
            {loadingPlaces ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3">
          {places.length > 0 ? (
            <ul className="space-y-3">
              {places.map((place) => (
                <li key={`${place.name}-${place.address}`} className="text-sm">
                  <a href={place.mapsUrl} target="_blank" rel="noreferrer" className="font-medium text-sky-800 hover:underline">
                    {place.name}
                  </a>
                  <p className="mt-0.5 text-slate-500">{place.address}</p>
                  {place.phone && <a className="text-sky-700" href={`tel:${place.phone}`}>{place.phone}</a>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 mt-2">Select a service and click find to see nearby locations.</p>
          )}
        </div>
      </div>

      {/* Injury Image Analysis Card */}
      <div className="flex h-[300px] flex-col rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-navy">
          <ImagePlus className="h-5 w-5 text-safety" />
          Injury image analysis
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          Paste a public image URL to assess.
        </p>
        <form onSubmit={analyze} className="mt-3 flex gap-2">
          <input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            type="url"
            required
            placeholder="https://…"
            className="focus-ring min-w-0 flex-1 rounded-lg border px-2 py-2 text-sm"
          />
          <button disabled={loadingImage} className="focus-ring rounded-lg bg-navy px-3 py-2 text-sm text-white disabled:opacity-60">
            {loadingImage ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Analyze"}
          </button>
        </form>
        <div className="flex-1 overflow-y-auto mt-3 pr-1">
          {imageResult ? (
            <div className="rounded-xl bg-slate-50 p-3 text-sm">
              <p className="font-medium text-navy">{imageResult.injuryType} · {imageResult.severity}</p>
              <ul className="mt-2 space-y-1 text-slate-600">
                {imageResult.recommendations.map((step) => <li key={step}>• {step}</li>)}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-2">Submit a direct URL to analyze image details.</p>
          )}
        </div>
      </div>

      {/* Emergency Report Card */}
      <div className="flex h-[300px] flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 font-semibold text-navy">
            <Download className="h-5 w-5 text-safety" />
            Emergency report
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Download a PDF timeline of this session to share with a clinician or keep for reference.
          </p>
        </div>
        <button
          onClick={downloadReport}
          disabled={downloading}
          className="focus-ring mt-5 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-navy hover:bg-slate-50 disabled:opacity-60"
        >
          {downloading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download PDF
        </button>
      </div>
    </section>
  );
}
