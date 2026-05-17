export default function SystemPanel() {
  return (
    <div className="system-panel" aria-label="Animated full-stack system preview">
      <div className="system-panel__top">
        <div className="system-panel__lights" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>Production flow</span>
      </div>

      <div className="system-panel__grid">
        {[
          ["UI", "React", "State"],
          ["API", "Node", "Auth"],
          ["Data", "Prisma", "SQL"],
        ].map(([label, a, b]) => (
          <div className="system-node" key={label}>
            <span className="system-node__label">{label}</span>
            <span className="system-node__line">{a}</span>
            <span className="system-node__line">{b}</span>
          </div>
        ))}
      </div>

      <div className="system-panel__footer">
        {["request", "cache", "database"].map((route) => (
          <div className="system-route" key={route}>
            <span>{route}</span>
            <span className="system-route__bar" />
            <span>ok</span>
          </div>
        ))}
      </div>
    </div>
  );
}