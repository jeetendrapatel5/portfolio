import ProjectPreview from "@/components/project/ProjectPreview";

export default function ProjectCard({ project, index }) {
  return (
    <article className="project-card" data-reveal style={{ "--delay": `${index * 95}ms` }}>
      <ProjectPreview type={project.preview} title={project.title} />

      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="project-card__number">{project.number}</span>
          <span>{project.category}</span>
          <span>{project.year}</span>
          <span>{project.status}</span>
        </div>

        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__subtitle">{project.subtitle}</p>
        <p className="project-card__story">{project.story}</p>

        <ul className="project-card__signals" aria-label={`${project.title} highlights`}>
          {project.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>

        <ul className="tag-list" aria-label={`${project.title} technology stack`}>
          {project.stack.map((tag) => (
            <li className="tag" key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}