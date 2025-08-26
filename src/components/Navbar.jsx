import './css/navbar.css'

export default function Navbar ({ user, onLogout, theme, onToggleTheme, navigateTo }) {
  return (
    <nav className="navbar">
      <div className="navbar__logo">MiLogo</div>
      <ul className="navbar__menu">
        <li className="navbar__menu-item" onClick={() => navigateTo('dashboard')}>Dashboard</li>
        <li className="navbar__menu-item" onClick={() => navigateTo('tareas')}>Tareas</li>
      </ul>
      <div className="navbar__user-section">
        {/*Tema*/}
        <button className="navbar__theme-button" onClick={onToggleTheme} aria-label="Cambiar Tema">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user?.usuario ? (
          <>
            <div className="navbar__user-info">
              <div className="navbar__user-avatar">
                {user.usuario.charAt(0).toUpperCase()}
              </div>
              <span>Hola, {user.usuario}</span>
            </div>
            <button className="navbar__logout-button" onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : null}
      </div>
    </nav>
  )
}
