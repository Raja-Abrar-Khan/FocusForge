function Footer() {
  return (
    <footer className="bg-[#1E2A44] text-[#D1D5DB] py-8 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">© 2025 FocusForge</p>
        <div className="mt-2 flex justify-between gap-4">
          <a href="#" className="text-[#FFD700] hover:text-[#00FFFF] transition">About</a>
          <a href="#" className="text-[#FFD700] hover:text-[#00FFFF] transition">Contact</a>
          <a href="#" className="text-[#FFD700] hover:text-[#00FFFF] transition">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;