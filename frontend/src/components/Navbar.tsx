import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Proverbs App</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li> */}
            <li className="nav-item"><Link className="nav-link" to="/proverbs">Proverbs</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin">Admin Panel</Link></li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {!token ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            ) : (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={logout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
