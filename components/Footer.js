export default function Footer() {
  return (
    <footer className="jooking-footer">
      <div>
        <strong>Jooking</strong>
        <p>Anonymous incident reporting and live risk intelligence.</p>
      </div>
      <span>© {new Date().getFullYear()} Jooking</span>
    </footer>
  );
}
