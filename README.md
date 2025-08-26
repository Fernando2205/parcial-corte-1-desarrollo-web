# Taller de Desarrollo - Aplicación To-Do

## Información General

- **Duración:** 3 horas
- **Base existente:** Login (localStorage), Navbar, Cards, To-Do, Contacto, tema claro/oscuro
- **Entregable:** repo GitHub o archivo .zip

## Descripción

La aplicación debe permitir el ingreso como **Admin** o como **Usuario** regular.

## Funcionalidades Requeridas

### 1. Sistema de Filtros para To-Do

- Agregar botones o selectores para filtrar tareas: **Todos** | **Pendientes** | **Completados**
- El filtro debe mantenerse aunque se agreguen nuevas tareas (no debe "resetearse")
- El estado del filtro debe persistir por usuario (ej. en localStorage bajo `todoFilter_{usuario}`) o rehidratarse desde la UI

### 2. Edición de Tareas

- Permitir editar el texto de una tarea existente (doble click sobre el texto o botón Editar)
- Guardar el cambio de forma inmutable en estado y persistir en localStorage
- Opciones de guardado: Cancelar con **Esc** o confirmar con **Enter** / botón **Guardar**
- **Restricción:** Solo el admin puede borrar las tareas de los usuarios

### 3. Dashboard Administrativo

Crear un nuevo componente `Dashboard.jsx` con las siguientes características:

#### Para Administradores (`usuario === "admin"`)

- Saludo dinámico según la hora del día: "Buenos días/tardes/noches, {usuario}"
- Número de tareas pendientes de todos los usuarios (sumadas)
- Número total de tareas (pendientes + completadas)

#### Para Usuarios Regulares

- Dashboard con métricas personales (ejemplo: cuántas tareas han agregado)

#### Pista Técnica

- Recorrer localStorage y acumular todas las claves que empiecen por `todos_` (arrays de tareas por usuario)

#### Criterios de Aceptación

- ✅ Si inicia sesión como admin, se ven estadísticas globales
- ✅ Si inicia sesión como otro usuario, se ve su resumen personal
- ✅ El saludo cambia correctamente según la hora del computador

### 4. Estilos y UX

- Aplicar estilos básicos para que los nuevos elementos (filtros, edición, dashboard) se vean bien en **tema claro y oscuro**
- Incluir `aria-label` en los botones/inputs agregados (accesibilidad mínima)
- Estados vacíos visibles (ej. "No hay tareas para este filtro")

## Reglas

- **Trabajo individual.** Puede consultar documentación, pero no compartir código entre compañeros
- **Entregue solo lo que funcione;** documente en README lo que no alcanzó

## Entrega

- Repositorio GitHub o archivo .zip del proyecto

Todas las funcionalidades OK ✅
