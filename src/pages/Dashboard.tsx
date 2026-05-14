import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../features/auth/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function Dashboard() {
  const { state, dispatch } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get<Project[]>('/projects'),
          api.get<Column[]>('/columns'),
        ]);

        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function addProject(name: string, color: string) {
    setSaving(true);
    setError(null);

    try {
      const res = await api.post<Project>('/projects', { name, color });
      setProjects((prev) => [...prev, res.data]);
      setShowForm(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || `Erreur ${err.response?.status}`;
        setError(message);
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setSaving(false);
    }
  }

  async function renameProject(project: Project) {
    const newName = prompt('Nouveau nom du projet:', project.name);
    if (!newName || newName === project.name) return;

    try {
      await api.put(`/projects/${project.id}`, { ...project, name: newName });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, name: newName } : p))
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || `Erreur ${err.response?.status}`;
        setError(message);
      } else {
        setError('Erreur inconnue');
      }
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) return;

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || `Erreur ${err.response?.status}`;
        setError(message);
      } else {
        setError('Erreur inconnue');
      }
    }
  }

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        userName={state.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      <div className={styles.body}>
        <Sidebar projects={projects} isOpen={sidebarOpen} />
        <div className={styles.content}>
          <div className={styles.toolbar}>
            {!showForm ? (
              <button
                className={styles.addBtn}
                onClick={() => setShowForm(true)}
                disabled={saving}
              >
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                initialName=""
                initialColor="#3498db"
                onSubmit={addProject}
                onCancel={() => setShowForm(false)}
                submitLabel="Ajouter"
              />
            )}
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}
