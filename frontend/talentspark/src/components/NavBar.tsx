type NavBarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

function NavBar({ currentPage, onNavigate, onLogout }: NavBarProps) {
  return (
    <header className="app-header">
      <div className="navbar-brand" onClick={() => onNavigate('home')}>
        <span className="brand-spark">⚡</span> TalentSpark <span className="brand-ai">AI</span>
      </div>
      <nav className="navbar">
        <ul className="navbar-menu">
          <li
            onClick={() => onNavigate('home')}
            className={`navbar-item ${currentPage === 'home' ? 'active' : ''}`}
          >
            Home
          </li>
          <li
            onClick={() => onNavigate('chat')}
            className={`navbar-item ${currentPage === 'chat' ? 'active' : ''}`}
          >
            Chat
          </li>
          <li
            onClick={() => onNavigate('resume')}
            className={`navbar-item ${currentPage === 'resume' ? 'active' : ''}`}
          >
            Resume
          </li>
          <li
            onClick={() => onNavigate('jobmatch')}
            className={`navbar-item ${currentPage === 'jobmatch' ? 'active' : ''}`}
          >
            Job Match
          </li>
        </ul>
      </nav>
      <div className="navbar-actions">
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default NavBar;