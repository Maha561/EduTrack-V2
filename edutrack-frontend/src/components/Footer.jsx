import { GraduationCap } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-brand">

          <div className="footer-logo">

            <GraduationCap size={24} />

          </div>

          <div>

            <h2>EduTrack</h2>

            <p>STUDENT ANALYTICS</p>

          </div>

        </div>

        <div className="footer-links">

          <a href="#features">Features</a>

          <a href="#modules">Modules</a>

          <a href="/login">Sign In</a>

        </div>

      </div>

      <hr />

      <div className="footer-bottom">

        <p>
          © 2026 EduTrack. All Rights Reserved.
        </p>

        <p>
          Built for modern universities.
        </p>

      </div>

    </footer>
  );
}

export default Footer;