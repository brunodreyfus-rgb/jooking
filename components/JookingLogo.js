export default function JookingLogo({ className = '' }) {
  return (
    <div className={`jooking-logo ${className}`.trim()} aria-label="Jooking">
      <span className="jooking-logo-mark">J</span>
      <span className="jooking-logo-text">Jooking</span>
    </div>
  );
}
