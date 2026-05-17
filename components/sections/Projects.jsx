import { PROJECTS } from "@/data/portfolioData";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/project/ProjectCard";

export default function Projects() {
  return (
    <section className="section projects" id="projects">
      <SectionHeader
        index="02"
        kicker="Selected work"
        title="Projects with a product spine."
        copy="Each piece is framed as a business problem, a technical system, and a crafted user experience. That is the difference between showing screens and showing judgment."
      />

      <div className="project-list">
        {PROJECTS.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.title} />
        ))}
      </div>
    </section>
  );
}