export default function TerminalPreview() {
  return (
    <div className="preview-terminal" aria-hidden="true">
      <span>$ create invoice --client premium</span>
      <span>$ sync payment_state --stripe</span>
      <span>$ ship clean handoff --done</span>
    </div>
  );
}