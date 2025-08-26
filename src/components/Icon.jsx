// Componente simple para iconos Font Awesome
export const Icon = ({ name, className = '', style = {} }) => {
  return <i className={`fas fa-${name} ${className}`} style={style}></i>
}

export default Icon
