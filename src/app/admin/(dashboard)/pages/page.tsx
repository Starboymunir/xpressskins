import Link from "next/link";
import { redirect } from "next/navigation";
import { listPages, isBuilderUser } from "@/builder/server";
import NewPageForm from "./NewPageForm";
import PageRowActions from "./PageRowActions";

export const dynamic = "force-dynamic";

export default async function PagesIndex() {
  const { role } = await isBuilderUser();
  if (!role) redirect("/admin/login");
  const pages = await listPages();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pages</h1>
          <p className="text-sm text-gray-400">
            Create, edit and publish pages with the visual builder.
          </p>
        </div>
      </div>

      <NewPageForm />

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0f]">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No pages yet — create your first one above.
                </td>
              </tr>
            )}
            {pages.map((p) => (
              <tr key={p.id} className="text-gray-300">
                <td className="px-4 py-3 font-medium text-white">{p.title}</td>
                <td className="px-4 py-3">
                  <code className="rounded bg-white/[0.04] px-2 py-0.5 text-xs">
                    /p/{p.slug || ""}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      p.status === "published"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : p.status === "draft"
                          ? "bg-amber-500/10 text-amber-300"
                          : "bg-white/[0.06] text-gray-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {new Date(p.updated_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/admin/pages/${p.id}/edit`}
                      className="rounded-lg bg-[#ff1a6c]/10 px-3 py-1.5 text-xs font-semibold text-[#ff1a6c] hover:bg-[#ff1a6c]/20"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/p/${p.slug}`}
                      target="_blank"
                      className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      View
                    </Link>
                    <PageRowActions id={p.id} isAdmin={role === "admin"} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
