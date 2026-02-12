import { getActiveProjects } from "@/lib/data";
import { ProjectsBoard } from "./ProjectsBoard";

export default async function ProjectsPage() {
  const projects = await getActiveProjects();
  return <ProjectsBoard projects={projects} />;
}
