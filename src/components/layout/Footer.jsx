export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>&copy; {year} WealthHealth. All rights reserved.</p>
    </footer>
  );
}
