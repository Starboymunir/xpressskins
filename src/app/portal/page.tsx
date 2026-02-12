import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PortalDashboard } from "./PortalDashboard";
import { createServiceClient } from "@/lib/supabase/server";

export default async function PortalPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch customer orders + projects
  const service = createServiceClient();

  const [ordersResult, projectsResult, revisionsResult] = await Promise.all([
    service
      .from("orders")
      .select("*")
      .eq("customer_email", user.email)
      .order("created_at", { ascending: false }),
    service
      .from("projects")
      .select("*")
      .eq("customer_email", user.email)
      .order("created_at", { ascending: false }),
    service
      .from("revisions")
      .select("*")
      .eq("customer_email", user.email)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <PortalDashboard
      user={{ email: user.email ?? "", name: user.user_metadata?.name ?? "" }}
      orders={ordersResult.data ?? []}
      projects={projectsResult.data ?? []}
      revisions={revisionsResult.data ?? []}
    />
  );
}
