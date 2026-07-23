import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">

        <div className="logo-icon">
          <GraduationCap size={26} />
        </div>

        <div>
          <h2>EduTrack</h2>
          <p>STUDENT ANALYTICS</p>
        </div>

      </div>

      <div className="nav-center">

        <a href="#features">Features</a>

        <a href="#modules">Modules</a>

        <Link to="/login">
          Sign in
        </Link>

      </div>

      <Link to="/login">

        <button className="nav-btn">

          Sign in

          <ArrowRight size={18} />

        </button>

      </Link>

    </nav>
  );
}

export default Navbar;