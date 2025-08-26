import { useMemo } from 'react'
import Icon from './Icon'
import './css/dashboard.css'

export default function Dashboard ({ user }) {
  // Función para obtener saludo dinámico según la hora
  const getSaludo = () => {
    const hora = new Date().getHours()
    if (hora >= 5 && hora < 12) {
      return 'Buenos días'
    } else if (hora >= 12 && hora < 18) {
      return 'Buenas tardes'
    } else {
      return 'Buenas noches'
    }
  }

  // Función para obtener todas las tareas de todos los usuarios (solo para admin)
  const getEstadisticasGlobales = useMemo(() => {
    const estadisticas = {
      totalTareas: 0,
      tareasPendientes: 0,
      tareasCompletadas: 0,
      totalUsuarios: 0
    }

    // Recorrer localStorage para encontrar claves que empiecen por 'todos_'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)

      if (key && key.startsWith('todos_')) {
        const tareas = JSON.parse(localStorage.getItem(key) || '[]')
        estadisticas.totalTareas += tareas.length
        estadisticas.tareasPendientes += tareas.filter(t => !t.done).length
        estadisticas.tareasCompletadas += tareas.filter(t => t.done).length
      }

    }

    // Contar usuarios registrados
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    estadisticas.totalUsuarios = usuarios.length

    return estadisticas
  }, [])

  // Función para obtener estadísticas personales del usuario
  const getEstadisticasPersonales = useMemo(() => {
    const storageKey = `todos_${user?.usuario || 'anon'}`
    const tareas = JSON.parse(localStorage.getItem(storageKey) || '[]')

    return {
      totalTareas: tareas.length,
      tareasPendientes: tareas.filter(t => !t.done).length,
      tareasCompletadas: tareas.filter(t => t.done).length,
      porcentajeCompletado: tareas.length > 0 ? Math.round((tareas.filter(t => t.done).length / tareas.length) * 100) : 0
    }
  }, [user])

  const esAdmin = user?.rol === 'admin'
  const estadisticas = esAdmin ? getEstadisticasGlobales : getEstadisticasPersonales

  return (
    <div className="dashboard">
      {/* Saludo dinámico */}
      <h1 className="dashboard__greeting">
        {getSaludo()}, {user?.usuario || 'Usuario'}!
      </h1>

      {esAdmin ? (
        // Dashboard para Administradores
        <div className="dashboard__content">
          <h2 className="dashboard__title">
            <Icon name="chart-bar" />
            Dashboard Administrativo
          </h2>

          <div className="dashboard__metrics">
            <div className="dashboard__metric-card dashboard__metric-card--success">
              <h3 className="dashboard__metric-title">
                <Icon name="tasks" />
                Total de Tareas
              </h3>
              <p className="dashboard__metric-value">
                {estadisticas.totalTareas}
              </p>
            </div>

            <div className="dashboard__metric-card dashboard__metric-card--warning">
              <h3 className="dashboard__metric-title">
                <Icon name="clock" />
                Tareas Pendientes
              </h3>
              <p className="dashboard__metric-value">
                {estadisticas.tareasPendientes}
              </p>
            </div>

            <div className="dashboard__metric-card dashboard__metric-card--info">
              <h3 className="dashboard__metric-title">
                <Icon name="check-circle" />
                Tareas Completadas
              </h3>
              <p className="dashboard__metric-value">
                {estadisticas.tareasCompletadas}
              </p>
            </div>

            <div className="dashboard__metric-card dashboard__metric-card--secondary">
              <h3 className="dashboard__metric-title">
                <Icon name="users" />
                Usuarios Registrados
              </h3>
              <p className="dashboard__metric-value">
                {estadisticas.totalUsuarios}
              </p>
            </div>
          </div>

          <div className="dashboard__summary">
            <h3 className="dashboard__summary-title">
              <Icon name="chart-line" />
              Resumen del Sistema
            </h3>
            <ul className="dashboard__summary-list">
              <li className="dashboard__summary-item">
                <Icon name="bullseye" />
                <strong>Productividad global:</strong> {estadisticas.totalTareas > 0 ? Math.round((estadisticas.tareasCompletadas / estadisticas.totalTareas) * 100) : 0}% de tareas completadas
              </li>
              <li className="dashboard__summary-item">
                <Icon name="chart-bar" />
                <strong>Actividad:</strong> {estadisticas.tareasPendientes == 1 ? '1 tarea requiere atención' : `${estadisticas.tareasPendientes} tareas requieren atención`}
              </li>
              <li className="dashboard__summary-item">
                <Icon name="crown" />
                <strong>Rol:</strong> Administrador del sistema
              </li>
            </ul>
          </div>
        </div>
      ) : (
        // Dashboard para Usuarios Regulares
        <div className="dashboard__content">
          <h2 className="dashboard__title">
            <Icon name="chart-pie" />
            Mi Dashboard Personal
          </h2>

          <div className="dashboard__metrics">
            <div className="dashboard__metric-card dashboard__metric-card--success">
              <h3 className="dashboard__metric-title">
                <Icon name="list-alt" />
                Mis Tareas
              </h3>
              <p className="dashboard__metric-value">
                {estadisticas.totalTareas}
              </p>
            </div>

            <div className="dashboard__metric-card dashboard__metric-card--warning">
              <h3 className="dashboard__metric-title">
                <Icon name="hourglass-half" />
                Pendientes
              </h3>
              <p className="dashboard__metric-value">
                {estadisticas.tareasPendientes}
              </p>
            </div>

            <div className="dashboard__metric-card dashboard__metric-card--info">
              <h3 className="dashboard__metric-title">
                <Icon name="check-double" />
                Completadas
              </h3>
              <p className="dashboard__metric-value">
                {estadisticas.tareasCompletadas}
              </p>
            </div>

            <div className="dashboard__metric-card dashboard__metric-card--secondary">
              <h3 className="dashboard__metric-title">
                <Icon name="percentage" />
                Progreso
              </h3>
              <p className="dashboard__metric-value">
                {estadisticas.porcentajeCompletado}%
              </p>
            </div>
          </div>

          <div className="dashboard__summary">
            <h3 className="dashboard__summary-title">
              <Icon name="trophy" />
              Mi Progreso Personal
            </h3>
            <div className="dashboard__progress">
              <div className="dashboard__progress-bar">
                <div
                  className="dashboard__progress-fill"
                  style={{ width: `${estadisticas.porcentajeCompletado}%` }}
                ></div>
              </div>
              <p className="dashboard__progress-text">
                {estadisticas.porcentajeCompletado}% de tareas completadas
              </p>
            </div>
            <ul className="dashboard__summary-list">
              <li className="dashboard__summary-item">
                <Icon name="bullseye" />
                <strong>Estado:</strong> {estadisticas.tareasPendientes === 0 ? '¡Todas las tareas completadas!' : `${estadisticas.tareasPendientes} tareas por hacer`}
              </li>
              <li className="dashboard__summary-item">
                <Icon name="chart-bar" />
                <strong>Productividad:</strong> {estadisticas.totalTareas === 0 ? '¡Comienza agregando tu primera tarea!' : `Has completado ${estadisticas.tareasCompletadas} de ${estadisticas.totalTareas} tareas`}
              </li>
              <li className="dashboard__summary-item">
                <Icon name="user" />
                <strong>Rol:</strong> Usuario
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
