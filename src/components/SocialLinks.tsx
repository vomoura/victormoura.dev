function SocialLinks() {
  return (
    <nav className="links" aria-label="Social links">
      <a
        href="https://github.com/vomoura"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        <i className="fa-brands fa-github"></i>
      </a>
      <a
        href="https://linkedin.com/in/vomoura"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <i className="fa-brands fa-linkedin"></i>
      </a>
      <a href="mailto:contato@victormoura.dev" aria-label="E-mail">
        <i className="fa-solid fa-envelope"></i>
      </a>
    </nav>
  )
}

export default SocialLinks
