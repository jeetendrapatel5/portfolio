export default function PortalPreview() {
  return (
    <div className="preview-flow" aria-hidden="true">
      {[
        ["brief", "signed", "72%"],
        ["decision", "ready", "54%"],
        ["invoice", "sent", "86%"],
      ].map(([label, status, width]) => (
        <div className="preview-row" key={label}>
          <span>{label}</span>
          <span className="preview-meter" style={{ "--meter": width }} />
          <span className="preview-status">{status}</span>
        </div>
      ))}
    </div>
  );
}