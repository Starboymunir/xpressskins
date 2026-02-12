"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PortfolioImage, PortfolioVideo } from "@/lib/types";
import {
  PageHeader, Card, Badge, Input, Select, Button, EmptyState,
} from "@/components/admin/AdminUI";
import { Image as ImageIcon, Video, Plus, Pencil, Trash2, X, Upload } from "lucide-react";

const IMG_CATEGORIES = [
  { value: "Full Wrap", label: "Full Wrap" },
  { value: "Partial Wrap", label: "Partial Wrap" },
  { value: "Hood", label: "Hood" },
  { value: "Trunk", label: "Trunk" },
  { value: "Color Change", label: "Color Change" },
];

const VID_CATEGORIES = [
  { value: "Showcase", label: "Showcase" },
  { value: "Process", label: "Process" },
  { value: "Reveal", label: "Reveal" },
  { value: "Event", label: "Event" },
];

export default function PortfolioPage() {
  const supabase = createClient();
  const [tab, setTab] = useState<"images" | "videos">("images");
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingImg, setEditingImg] = useState<Partial<PortfolioImage> | null>(null);
  const [editingVid, setEditingVid] = useState<Partial<PortfolioVideo> | null>(null);
  const [saving, setSaving] = useState(false);
  const [bulkIds, setBulkIds] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  async function loadImages() {
    const { data } = await supabase.from("portfolio_images").select("*").order("sort_order");
    setImages((data as PortfolioImage[]) ?? []);
  }

  async function loadVideos() {
    const { data } = await supabase.from("portfolio_videos").select("*").order("sort_order");
    setVideos((data as PortfolioVideo[]) ?? []);
  }

  useEffect(() => {
    Promise.all([loadImages(), loadVideos()]).then(() => setLoading(false));
  }, []);

  // ─── Image CRUD ─────────────────────────────────
  async function saveImage() {
    if (!editingImg?.drive_id) return;
    setSaving(true);
    if (editingImg.id) {
      await supabase.from("portfolio_images").update(editingImg).eq("id", editingImg.id);
    } else {
      await supabase.from("portfolio_images").insert(editingImg);
    }
    setSaving(false);
    setEditingImg(null);
    loadImages();
  }

  async function deleteImage(id: string) {
    if (!confirm("Delete this image?")) return;
    await supabase.from("portfolio_images").delete().eq("id", id);
    loadImages();
  }

  // ─── Bulk import images ─────────────────────────
  async function bulkImportImages() {
    const ids = bulkIds.split("\n").map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) return;
    setSaving(true);
    const rows = ids.map((drive_id, i) => ({
      drive_id,
      alt: `Xpress Skins wrap photo`,
      category: "Full Wrap",
      sort_order: images.length + i,
    }));
    await supabase.from("portfolio_images").insert(rows);
    setSaving(false);
    setBulkIds("");
    setShowBulk(false);
    loadImages();
  }

  // ─── Video CRUD ─────────────────────────────────
  async function saveVideo() {
    if (!editingVid?.drive_id) return;
    setSaving(true);
    if (editingVid.id) {
      await supabase.from("portfolio_videos").update(editingVid).eq("id", editingVid.id);
    } else {
      await supabase.from("portfolio_videos").insert(editingVid);
    }
    setSaving(false);
    setEditingVid(null);
    loadVideos();
  }

  async function deleteVideo(id: string) {
    if (!confirm("Delete this video?")) return;
    await supabase.from("portfolio_videos").delete().eq("id", id);
    loadVideos();
  }

  return (
    <div>
      <PageHeader title="Portfolio & Media" description={`${images.length} images · ${videos.length} videos`}>
        <Button variant="secondary" onClick={() => setShowBulk(true)}>
          <Upload size={14} /> Bulk Import
        </Button>
        <Button onClick={() => tab === "images"
          ? setEditingImg({ drive_id: "", alt: "", category: "Full Wrap", featured: false, sort_order: images.length })
          : setEditingVid({ drive_id: "", title: "", category: "Showcase", featured: false, sort_order: videos.length })
        }>
          <Plus size={16} /> Add {tab === "images" ? "Image" : "Video"}
        </Button>
      </PageHeader>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-white/[0.03] p-1 border border-white/[0.06] w-fit">
        {(["images", "videos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              tab === t ? "bg-[#ff1a6c]/10 text-[#ff1a6c]" : "text-gray-400 hover:text-white"
            }`}
          >
            {t === "images" ? <ImageIcon size={14} /> : <Video size={14} />}
            {t === "images" ? `Images (${images.length})` : `Videos (${videos.length})`}
          </button>
        ))}
      </div>

      {/* IMAGES TAB */}
      {tab === "images" && (
        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#ff1a6c]" />
            </div>
          ) : images.length === 0 ? (
            <EmptyState icon={ImageIcon} title="No images yet" description="Add portfolio images to showcase your work." />
          ) : (
            <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {images.map((img) => (
                <div key={img.id} className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03]">
                  <div className="aspect-square">
                    <img
                      src={`/portfolio/${img.drive_id}.jpg`}
                      alt={img.alt}
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://lh3.googleusercontent.com/d/${img.drive_id}=s400`; }}
                    />
                  </div>
                  <div className="p-2">
                    <Badge>{img.category}</Badge>
                    {img.featured && <Badge variant="accent">★</Badge>}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => setEditingImg(img)} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteImage(img.id)} className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* VIDEOS TAB */}
      {tab === "videos" && (
        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[#ff1a6c]" />
            </div>
          ) : videos.length === 0 ? (
            <EmptyState icon={Video} title="No videos yet" description="Add build videos to showcase your process." />
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((vid) => (
                <div key={vid.id} className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03]">
                  <div className="aspect-video">
                    <iframe
                      src={`https://drive.google.com/file/d/${vid.drive_id}/preview`}
                      title={vid.title}
                      className="h-full w-full border-0"
                      allow="autoplay; encrypted-media"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{vid.title}</p>
                      <Badge>{vid.category}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditingVid(vid)} className="rounded-lg p-2 text-gray-400 hover:bg-white/[0.05] hover:text-white">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteVideo(vid.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Image edit modal */}
      {editingImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0f] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">{editingImg.id ? "Edit Image" : "Add Image"}</h2>
              <button onClick={() => setEditingImg(null)} className="rounded-lg p-2 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <Input label="Google Drive File ID" value={editingImg.drive_id ?? ""} onChange={(e) => setEditingImg({ ...editingImg, drive_id: e.target.value })} placeholder="1T7a5RDQuv6wPfr..." />
              <Input label="Alt Text" value={editingImg.alt ?? ""} onChange={(e) => setEditingImg({ ...editingImg, alt: e.target.value })} placeholder="Describe the image" />
              <Select label="Category" value={editingImg.category ?? "Full Wrap"} onChange={(e) => setEditingImg({ ...editingImg, category: e.target.value as PortfolioImage["category"] })} options={IMG_CATEGORIES} />
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={editingImg.featured ?? false} onChange={(e) => setEditingImg({ ...editingImg, featured: e.target.checked })} className="h-4 w-4 rounded border-white/20 bg-white/5" />
                <label className="text-sm text-gray-300">Featured</label>
              </div>
              <Input label="Sort Order" type="number" value={editingImg.sort_order ?? 0} onChange={(e) => setEditingImg({ ...editingImg, sort_order: Number(e.target.value) })} />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditingImg(null)}>Cancel</Button>
              <Button onClick={saveImage} loading={saving}>{editingImg.id ? "Update" : "Add Image"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Video edit modal */}
      {editingVid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0f] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">{editingVid.id ? "Edit Video" : "Add Video"}</h2>
              <button onClick={() => setEditingVid(null)} className="rounded-lg p-2 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <Input label="Google Drive File ID" value={editingVid.drive_id ?? ""} onChange={(e) => setEditingVid({ ...editingVid, drive_id: e.target.value })} placeholder="1l3mw1MDSvNQ4fW..." />
              <Input label="Video Title" value={editingVid.title ?? ""} onChange={(e) => setEditingVid({ ...editingVid, title: e.target.value })} placeholder="Eduardo Build Showcase" />
              <Select label="Category" value={editingVid.category ?? "Showcase"} onChange={(e) => setEditingVid({ ...editingVid, category: e.target.value as PortfolioVideo["category"] })} options={VID_CATEGORIES} />
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={editingVid.featured ?? false} onChange={(e) => setEditingVid({ ...editingVid, featured: e.target.checked })} className="h-4 w-4 rounded border-white/20 bg-white/5" />
                <label className="text-sm text-gray-300">Featured</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditingVid(null)}>Cancel</Button>
              <Button onClick={saveVideo} loading={saving}>{editingVid.id ? "Update" : "Add Video"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk import modal */}
      {showBulk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0f] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Bulk Import Images</h2>
              <button onClick={() => setShowBulk(false)} className="rounded-lg p-2 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <p className="mb-4 text-sm text-gray-400">Paste Google Drive file IDs, one per line. They&apos;ll be added as &quot;Full Wrap&quot; images.</p>
            <textarea
              rows={10}
              value={bulkIds}
              onChange={(e) => setBulkIds(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 font-mono text-xs text-white placeholder-gray-500 outline-none focus:border-[#ff1a6c]/50"
              placeholder={"1T7a5RDQuv6wPfrbvSZZii6Yt2nMzYcAR\n19pWPcT-N-psJHq3uRyTa-hQITrTxJUTq\n..."}
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">{bulkIds.split("\n").filter(Boolean).length} IDs</span>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowBulk(false)}>Cancel</Button>
                <Button onClick={bulkImportImages} loading={saving}>
                  <Upload size={14} /> Import All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
