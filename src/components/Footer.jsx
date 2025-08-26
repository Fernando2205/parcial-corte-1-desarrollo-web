import './css/footer.css'

function Footer () {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <p>© {year} Mi Página. Todos los derechos reservados.</p>
    </footer>
  )
}
export default Footer
