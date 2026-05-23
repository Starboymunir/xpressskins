import { redirect, notFound } from "next/navigation";
import { isBuilderUser, getPageById } from "@/builder/server";
import EditorShell from "./EditorShell";

export const dynamic = "force-dynamic";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { role } = await isBuilderUser();
  if (!role) redirect("/admin/login");
  const { id } = await params;
  const page = await getPageById(id);
  if (!page) notFound();

  return (
    <div className="-mx-4 -my-8 sm:-mx-6 lg:-mx-8">
      <EditorShell page={page} />
    </div>
  );
}
