import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

import Todo from './components/Todo'

import './index.css'

export default function App () {
  const [sesionActiva, setSesionActiva] = useState(false)
  const [user, setUser] = useState(null)
  const [paginaActual, setPaginaActual] = useState('inicio')

  //tema
  const [theme, setTheme] = useState('light')

  // Cargar estado desde localStorage al arrancar
  useEffect(() => {
    const ses = localStorage.getItem('sesion') === 'activa'

    // Obtener el usuario actual logueado
    const usuarioActual = localStorage.getItem('usuarioActual')
    if (usuarioActual && ses) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
      const userEncontrado = usuarios.find(u => u.usuario === usuarioActual)
      setUser(userEncontrado || null)
    } else {
      setUser(null)
    }

    setSesionActiva(ses)

    //tema
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)

  }, [])

  const handleLoginSuccess = () => {
    setSesionActiva(true)

    // Obtener el usuario actual logueado
    const usuarioActual = localStorage.getItem('usuarioActual')
    if (usuarioActual) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
      const userEncontrado = usuarios.find(u => u.usuario === usuarioActual)
      setUser(userEncontrado || null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('sesion')
    localStorage.removeItem('usuarioActual')
    setSesionActiva(false)
    setUser(null)
  }

  //tema---
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const navigateTo = (page) => {
    setPaginaActual(page)
  }

  const renderPage = () => {
    switch (paginaActual) {
    case 'dashboard':
      return (
        <Dashboard user={user} />
      )
    case 'tareas':
      return (
        <>
          {/* To-do por usuario*/}
          <Todo user={user} />
        </>
      )
    default:
      return (
        <Dashboard user={user} />
      )
    }
  }

  if (!sesionActiva) {
    // Solo muestra el Login si no hay sesión
    return <Login onLogin={handleLoginSuccess} />
  }

  // Con sesión activa, ya mostramos el resto de la página
  return (
    <>
      <Navbar
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
        navigateTo={navigateTo}

      />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer />
    </>
  )
}
