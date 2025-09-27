import React from "react";

function Footer() {
  return (
    <footer style={{ background: "#1e293b", padding: "30px 20px", textAlign: "center" }}>
      <p style={{ color: "#cbd5e1", marginBottom: "10px" }}>
        © {new Date().getFullYear()} SkillQuest. All rights reserved.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
        <a href="/about" style={{ color: "#22c55e", textDecoration: "none" }}>About</a>
        <a href="/contact" style={{ color: "#22c55e", textDecoration: "none" }}>Contact</a>
        <a href="/privacy" style={{ color: "#22c55e", textDecoration: "none" }}>Privacy Policy</a>
      </div>
    </footer>
  );
}

export default Footer;
