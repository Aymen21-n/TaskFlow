import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios';
import Header from '../components/Header';
import { logout } from '../features/auth/authSlice';
import type { RootState } from '../store';
import styles from './ProjectDetail.module.css';

interface Project {
  id: string;
  name: string;
  color: string;
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await api.get<Project>(`/projects/${id}`);
        setProject(res.data);
      } catch (error) {
        console.error('Erreur:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id, navigate]);

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (!project) {
    return <div className={styles.loading}>Projet non trouvé</div>;
  }

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => navigate('/dashboard')}
        userName={authState.user?.name}
        onLogout={() => dispatch(logout())}
      />
      <main className={styles.main}>
        <div className={styles.header}>
          <div
            className={styles.dot}
            style={{ backgroundColor: project.color }}
          />
          <div>
            <h1>{project.name}</h1>
            <p className={styles.info}>ID: {project.id}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
