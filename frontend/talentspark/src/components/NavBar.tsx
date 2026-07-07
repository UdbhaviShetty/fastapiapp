type NavBarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

function NavBar({ currentPage, onNavigate }: NavBarProps) {
  const baseItemStyle: React.CSSProperties = {
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '15px',
    transition: 'all 0.15s ease',
    padding: '4px 2px'
  };

  return (
    <nav className="navbar" style={{ borderBottom: 'none', paddingBottom: 0, width: '100%' }}>
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '28px',
        padding: 0,
        margin: 0
      }}>
        <li
          onClick={() => onNavigate('home')}
          style={{ ...baseItemStyle, fontWeight: 600, color: currentPage === 'home' ? 'var(--accent)' : 'var(--text)' }}
        >
          Home
        </li>
        <li
          onClick={() => onNavigate('chat')}
          style={{ ...baseItemStyle, color: currentPage === 'chat' ? 'var(--accent)' : 'var(--text)' }}
        >
          Chat
        </li>
        <li
          onClick={() => onNavigate('resume')}
          style={{ ...baseItemStyle, color: currentPage === 'resume' ? 'var(--accent)' : 'var(--text)' }}
        >
          Resume
        </li>
        <li
          onClick={() => onNavigate('jobmatch')}
          style={{ ...baseItemStyle, color: currentPage === 'jobmatch' ? 'var(--accent)' : 'var(--text)' }}
        >
          Job Match
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;