"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  PageHeader, Card, Badge, Input, EmptyState,
} from "@/components/admin/AdminUI";
import {
  Car, Upload, Trash2, Search, FileSpreadsheet, CheckCircle, AlertTriangle, Loader2, Download,
} from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  total_sqft: number;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ totalVehicles: 0, totalMakes: 0 });
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success?: boolean;
    message?: string;
    errors?: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      setVehicles(data.vehicles ?? []);
    } catch {
      // silently fail
    }
    setLoading(false);
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/vehicles/stats");
      const data = await res.json();
      setStats({ totalVehicles: data.totalVehicles ?? 0, totalMakes: data.totalMakes ?? 0 });
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    loadVehicles();
    loadStats();
  }, [loadVehicles, loadStats]);

  const filtered = vehicles.filter(
    (v) =>
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.trim.toLowerCase().includes(search.toLowerCase()) ||
      String(v.year).includes(search)
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/vehicles/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadResult({
          success: true,
          message: data.message,
          errors: data.errors,
        });
        loadVehicles();
        loadStats();
      } else {
        setUploadResult({
          success: false,
          message: data.error || "Upload failed",
          errors: data.errors,
        });
      }
    } catch {
      setUploadResult({
        success: false,
        message: "Network error. Please try again.",
      });
    }

    setUploading(false);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    const res = await fetch("/api/vehicles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      loadStats();
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vehicle Database"
        description="Upload and manage the vehicle sqft database that powers the pricing calculator."
      >
        <label className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-[#ff1a6c] text-white hover:bg-[#ff1a6c]/90 transition-colors cursor-pointer">
          <Upload size={16} />
          Upload Excel
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="sr-only"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </PageHeader>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#ff1a6c]/10">
              <Car size={20} className="text-[#ff1a6c]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalVehicles.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Vehicles</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <FileSpreadsheet size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalMakes}</p>
              <p className="text-sm text-gray-400">Makes / Brands</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Download size={20} className="text-cyan-400" />
            </div>
            <div>
              <a
                href="/Car Database.xlsx"
                download
                className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                Download Current Template
              </a>
              <p className="text-xs text-gray-500 mt-1">Use this format for uploads</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upload result */}
      {uploadResult && (
        <Card>
          <div className={`flex items-start gap-3 ${uploadResult.success ? "text-green-400" : "text-red-400"}`}>
            {uploadResult.success ? (
              <CheckCircle size={20} className="shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{uploadResult.message}</p>
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <details className="mt-2">
                  <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                    {uploadResult.errors.length} warnings
                  </summary>
                  <ul className="mt-1 space-y-0.5 text-xs text-gray-500">
                    {uploadResult.errors.slice(0, 20).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {uploadResult.errors.length > 20 && (
                      <li>...and {uploadResult.errors.length - 20} more</li>
                    )}
                  </ul>
                </details>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Upload instructions */}
      <Card>
        <h3 className="text-white font-semibold mb-2">How to Upload</h3>
        <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
          <li>Prepare your Excel file with columns: <span className="text-gray-300">Brand, Model, Year, Trim, 25% sqft, 50% sqft, 75% sqft, 100% sqft</span></li>
          <li>The <span className="text-[#ff1a6c]">100% sqft</span> column (column H) is the total wrap area used for pricing</li>
          <li>Click &ldquo;Upload Excel&rdquo; above and select your file</li>
          <li>The upload will <span className="text-yellow-400">replace all existing</span> vehicle data</li>
        </ol>
      </Card>

      {/* Search + vehicle table */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Search by make, model, year, or trim..."
              className="pl-10"
            />
          </div>
          <Badge variant={filtered.length === vehicles.length ? "default" : "pink"}>
            {filtered.length} of {vehicles.length}
          </Badge>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        ) : vehicles.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No vehicles yet"
            description="Upload an Excel file to populate the vehicle database."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/5 text-gray-400">
                  <th className="py-3 px-3 font-medium">Make</th>
                  <th className="py-3 px-3 font-medium">Model</th>
                  <th className="py-3 px-3 font-medium">Year</th>
                  <th className="py-3 px-3 font-medium">Trim</th>
                  <th className="py-3 px-3 font-medium text-right">Total sqft</th>
                  <th className="py-3 px-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map((v) => (
                  <tr key={v.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 text-white font-medium">{v.make}</td>
                    <td className="py-2.5 px-3 text-gray-300">{v.model}</td>
                    <td className="py-2.5 px-3 text-gray-400">{v.year}</td>
                    <td className="py-2.5 px-3 text-gray-400">{v.trim}</td>
                    <td className="py-2.5 px-3 text-right text-[#ff1a6c] font-semibold">{v.total_sqft}</td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 200 && (
              <p className="text-center text-gray-500 text-xs py-3">
                Showing 200 of {filtered.length} results. Use search to narrow down.
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
