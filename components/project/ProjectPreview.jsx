import PortalPreview from '@/components/project/PortalPreview';
import MapPreview from '@/components/project/MapPreview';
import TerminalPreview from '@/components/project/TerminalPreview';

export default function ProjectPreview({ type, title }) {
  return (
    <div className={`project-preview project-preview--${type}`} data-cursor="focus" aria-label={`${title} visual preview`}>
      <div className="preview-window">
        <div className="preview-window__bar">
          <div className="preview-window__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span>{title}</span>
        </div>

        {type === "portal" ? <PortalPreview /> : null}
        {type === "map" ? <MapPreview /> : null}
        {type === "terminal" ? <TerminalPreview /> : null}

        <div className="preview-footer" aria-hidden="true">
          <span className="preview-chip">fast</span>
          <span className="preview-chip">clean</span>
          <span className="preview-chip">secure</span>
        </div>
      </div>
    </div>
  );
}