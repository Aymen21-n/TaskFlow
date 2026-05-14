import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRename?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export default function Sidebar({ projects, isOpen, onRename, onDelete }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <h2 className={styles.title}>Mes Projets</h2>
      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <NavLink
              to={'/projects/' + p.id}
              className={({ isActive }) =>
                styles.item + (isActive ? ' ' + styles.active : '')
              }
              style={{ flex: 1 }}
            >
              <span className={styles.dot} style={{ background: p.color }} />
              {p.name}
            </NavLink>
            {onRename ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onRename(p);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: 0.6,
                  fontSize: '1rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
              >
                ✏️
              </button>
            ) : null}
            {onDelete ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(p.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: 0.6,
                  fontSize: '1rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
              >
                🗑️
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </aside>
  );
} 