import { NavLink, Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-brand">
          <Link to="/create">
            <div className="logo">
              <p>Wealth</p>
              <img
                src="/logoWealthHealth-no_bg.png"
                alt="WealthHealth"
                className="header-logo"
              />
              <p>Health</p>
            </div>
          </Link>
        </div>
        <nav className="header-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Create Employee
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            View Employees
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
