import { useEffect, useMemo, useState } from 'react'
import Icon from './Icon'
import './css/todo.css'

export default function Todo ({ user }) {
  const [items, setItems] = useState([])
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('todos')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [selectedUser, setSelectedUser] = useState(user?.usuario || '')

  const isAdmin = user?.rol === 'admin'

  // Para admin: obtener lista de todos los usuarios
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    if (isAdmin) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
      setAllUsers(usuarios.map(u => u.usuario))
      if (!selectedUser && usuarios.length > 0) {
        setSelectedUser(usuarios[0].usuario)
      }
    }
  }, [isAdmin, selectedUser])

  const currentStorageKey = useMemo(() => {
    const targetUser = isAdmin ? selectedUser : user?.usuario || 'anon'
    return `todos_${targetUser}`
  }, [isAdmin, selectedUser, user])

  const currentFilterKey = useMemo(() => {
    const targetUser = isAdmin ? selectedUser : user?.usuario || 'anon'
    return `todoFilter_${targetUser}`
  }, [isAdmin, selectedUser, user])

  // cargar tareas
  useEffect(() => {
    if (currentStorageKey) {
      const saved = JSON.parse(localStorage.getItem(currentStorageKey) || '[]')
      setItems(saved)
    }
  }, [currentStorageKey])

  // cargar filtro
  useEffect(() => {
    if (currentFilterKey) {
      const savedFilter = localStorage.getItem(currentFilterKey) || 'todos'
      setFilter(savedFilter)
    }
  }, [currentFilterKey])

  // guardar tareas
  useEffect(() => {
    if (currentStorageKey && items.length >= 0) {
      localStorage.setItem(currentStorageKey, JSON.stringify(items))
    }
  }, [items, currentStorageKey])

  // guardar filtro
  useEffect(() => {
    if (currentFilterKey) {
      localStorage.setItem(currentFilterKey, filter)
    }
  }, [filter, currentFilterKey])

  const addTodo = (e) => {
    e.preventDefault()
    const txt = text.trim()

    if (!txt) return

    setItems(prev => [
      ...prev, { id: crypto.randomUUID(), text: txt, done: false, ts: Date.now() }
    ])

    setText('')
  }

  const toggleTodo = (id) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, done: !it.done } : it))
  }

  const RemoveTodo = (id) => {
    // Solo el admin puede borrar tareas (de cualquier usuario)
    // Los usuarios regulares no pueden borrar tareas
    if (user?.rol !== 'admin') {
      return
    }

    setItems(prev => prev.filter(it => it.id !== id))
  }
  const ClearCompleted = () => {
    setItems(prev => prev.filter(it => !it.done))
  }

  // Funciones para edición de tareas
  const startEditing = (id, currentText) => {
    setEditingId(id)
    setEditingText(currentText)
  }

  const saveEdit = (id) => {
    const newText = editingText.trim()
    if (!newText) return

    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, text: newText } : item
    ))

    setEditingId(null)
    setEditingText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveEdit(id)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEdit()
    }
  }

  // Filtrar tareas según el filtro seleccionado
  const filteredItems = useMemo(() => {
    switch (filter) {
    case 'pendientes':
      return items.filter(item => !item.done)
    case 'completados':
      return items.filter(item => item.done)
    default:
      return items
    }
  }, [items, filter])

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  return (
    <div className="todo">
      <div className="todo__header">
        <h2 className="todo__title">
          <Icon name="tasks" />
          {isAdmin ? 'Gestión de Tareas (Admin)' : 'Lista de Tareas'}
        </h2>
        {isAdmin && allUsers.length > 0 && (
          <div className="todo__user-selector">
            <label htmlFor="userSelect" className="todo__user-label">
              <Icon name="user" /> Gestionar tareas de:
            </label>
            <select
              id="userSelect"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="todo__user-select"
            >
              {allUsers.map(username => (
                <option key={username} value={username}>
                  {username}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="todo__add-form">
        <form onSubmit={addTodo} className="todo__form">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nueva tarea"
            aria-label="Nueva tarea"
            className="todo__input"
          />
          <button type="submit" className="todo__add-button">
            <Icon name="plus" /> Agregar Tarea
          </button>
        </form>
      </div>

      {/* Botones de filtro */}
      <div className="todo__filters">
        <button
          onClick={() => handleFilterChange('todos')}
          className={`todo__filter-button ${filter === 'todos' ? 'todo__filter-button--active' : ''}`}
          aria-label="Mostrar todas las tareas"
        >
          <Icon name="list" /> Todos
        </button>
        <button
          onClick={() => handleFilterChange('pendientes')}
          className={`todo__filter-button ${filter === 'pendientes' ? 'todo__filter-button--active' : ''}`}
          aria-label="Mostrar tareas pendientes"
        >
          <Icon name="clock" /> Pendientes
        </button>
        <button
          onClick={() => handleFilterChange('completados')}
          className={`todo__filter-button ${filter === 'completados' ? 'todo__filter-button--active' : ''}`}
          aria-label="Mostrar tareas completadas"
        >
          <Icon name="check-circle" /> Completados
        </button>
      </div>

      <div className="todo__list-container">
        <ul className="todo__list">
          {items.length === 0 && (
            <div className="todo__empty-state">
              <Icon name="clipboard-list" />
              <p>No hay tareas</p>
            </div>
          )}

          {items.length > 0 && filteredItems.length === 0 && (
            <div className="todo__empty-state">
              <Icon name="search" />
              <p>
                {filter === 'pendientes' && 'No hay tareas pendientes'}
                {filter === 'completados' && 'No hay tareas completadas'}
              </p>
            </div>
          )}

          {filteredItems.map(item => (
            <li key={item.id} className="todo__item">

              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleTodo(item.id)}
                aria-label={`Marcar "${item.text}"`}
                className="todo__checkbox"
              />

              {editingId === item.id ? (
              // Modo edición
                <div className="todo__edit-container">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, item.id)}
                    onBlur={() => saveEdit(item.id)}
                    autoFocus
                    className="todo__edit-input"
                    aria-label="Editar tarea"
                  />
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="todo__action-button todo__save-button"
                    aria-label="Guardar cambios"
                  >
                    <Icon name="check" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="todo__action-button todo__cancel-button"
                    aria-label="Cancelar edición"
                  >
                    <Icon name="times" />
                  </button>
                </div>
              ) : (
              // Modo visualización
                <>
                  <span
                    className={`todo__text ${item.done ? 'todo__text--completed' : ''}`}
                    onDoubleClick={() => startEditing(item.id, item.text)}
                    title="Doble click para editar"
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() => startEditing(item.id, item.text)}
                    className="todo__action-button todo__edit-button"
                    aria-label="Editar tarea"
                  >
                    <Icon name="edit" />
                  </button>
                  <button
                    onClick={() => RemoveTodo(item.id)}
                    aria-label="Eliminar"
                    className="todo__action-button todo__delete-button"
                    disabled={user?.rol !== 'admin'}
                  >
                    <Icon name="trash" />
                  </button>
                </>
              )}
            </li>
          ))}

        </ul>
      </div>

      {isAdmin && (
        <div className="todo__footer">
          <button onClick={() => ClearCompleted()} className="todo__clear-button">
            <Icon name="broom" /> Borrar Tareas Completadas
          </button>
        </div>
      )}
    </div>
  )
}
