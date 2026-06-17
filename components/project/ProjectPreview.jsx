import PortalPreview from '@/components/project/PortalPreview';
import MapPreview from '@/components/project/MapPreview';
import TerminalPreview from '@/components/project/TerminalPreview';

export default function ProjectPreview({ type, title }) {
  return (
    <div className={`project-preview project-preview--${type}`} data-cursor="focus" aria-label={`${title} visual preview`}>
      <div>
        {type === "portal" ? <PortalPreview /> : null}
        {type === "map" ? <MapPreview /> : null}
        {type === "terminal" ? <TerminalPreview /> : null}
      </div>
    </div>
  );
}