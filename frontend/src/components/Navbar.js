import "./Navbar.css";

function Navbar(props) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>{props.title}</h2>
        <span>{props.subtitle}</span>
      </div>

      <button className="navbar-logout" onClick={props.onLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;