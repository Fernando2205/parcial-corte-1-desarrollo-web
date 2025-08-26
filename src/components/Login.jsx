import { useState } from "react";
import "./css/login.css";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [rol, setRol] = useState("usuario");
  const [mensaje, setMensaje] = useState("");
  const [registrando, setRegistrando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (registrando) {
      // Obtener usuarios existentes o crear array vacío
      const usuariosExistentes = JSON.parse(localStorage.getItem("usuarios") || "[]");

      // Verificar si el usuario ya existe
      const usuarioExiste = usuariosExistentes.find(u => u.usuario === usuario);
      if (usuarioExiste) {
        setMensaje("El usuario ya existe. Elige otro nombre de usuario.");
        return;
      }

      // Agregar nuevo usuario al array con rol
      const nuevosUsuarios = [...usuariosExistentes, { usuario, clave, rol }];
      localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
      setMensaje("Usuario registrado. Ahora inicia sesión.");
      setRegistrando(false);
      setClave("");
      setRol("usuario");
      return;
    }

    // Intento de login
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.clave === clave);

    if (usuarioEncontrado) {
      localStorage.setItem("sesion", "activa");
      localStorage.setItem("usuarioActual", usuario);
      setMensaje("Bienvenido " + usuario);
      // Avisar al componente padre (App) que el login fue exitoso
      onLogin?.();
    } else {
      setMensaje("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">
          {registrando ? "Registrar Usuario" : "Iniciar Sesión"}
        </h1>
        
        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__input-group">
            <label className="login__label" htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="login__input"
              required
            />
          </div>
          
          <div className="login__input-group">
            <label className="login__label" htmlFor="clave">Contraseña</label>
            <input
              id="clave"
              type="password"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="login__input"
              required
            />
          </div>
          
          {registrando && (
            <div className="login__input-group">
              <label className="login__label" htmlFor="rol">Rol de Usuario</label>
              <select
                id="rol"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="login__select"
                aria-label="Seleccionar rol de usuario"
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              <p className="login__role-info">
                {rol === "admin" 
                  ? "Los administradores pueden eliminar tareas de cualquier usuario" 
                  : "Los usuarios solo pueden gestionar sus propias tareas"
                }
              </p>
            </div>
          )}
          
          <button type="submit" className="login__submit-button">
            {registrando ? "Registrar" : "Ingresar"}
          </button>
        </form>

        <button
          onClick={() => {
            setRegistrando(!registrando);
            setMensaje("");
            setRol("usuario");
          }}
          className="login__toggle-button"
        >
          {registrando ? "Ya tengo cuenta" : "Crear nueva cuenta"}
        </button>

        {mensaje && (
          <div className={`login__message ${mensaje.includes("incorrectos") || mensaje.includes("existe") ? "login__message--error" : "login__message--success"}`}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}
