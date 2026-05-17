export default function MapPreview() {
  return (
    <div className="preview-map" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="preview-node" key={index}>
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}