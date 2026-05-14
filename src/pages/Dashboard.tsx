import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import { logout } from '../features/auth/authSlice';
import useProjects from '../hooks/useProjects';
import type { Project } from '../hooks/useProjects';
import type { RootState } from '../store';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { projects, columns, loading, error, addProject, renameProject, deleteProject } = useProjects();

  const handleRename = useCallback((project: Project) => {
    setShowForm(false);
    setEditingProject(project);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteProject(id);
  }, []);

  async function handleAddProject(name: string, color: string) {
    await addProject(name, color);
    setShowForm(false);
  }

  async function handleRenameProject(name: string) {
    if (!editingProject) return;

    await renameProject(editingProject, name);
    setEditingProject(null);
  }

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        userName={authState.user?.name}
        onLogout={() => dispatch(logout())}
      />
      <div className={styles.body}>
        <Sidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRename={handleRename}
          onDelete={handleDelete}
        />
        <div className={styles.content}>
          <div className={styles.toolbar}>
            {!showForm && !editingProject ? (
              <button
                className={styles.addBtn}
                onClick={() => {
                  setEditingProject(null);
                  setShowForm(true);
                }}
              >
                + Nouveau projet
              </button>
            ) : null}
            {showForm ? (
              <ProjectForm
                initialName=""
                initialColor="#3498db"
                onSubmit={handleAddProject}
                onCancel={() => setShowForm(false)}
                submitLabel="Ajouter"
              />
            ) : null}
            {editingProject ? (
              <ProjectForm
                key={editingProject.id}
                initialName={editingProject.name}
                initialColor={editingProject.color}
                onSubmit={handleRenameProject}
                onCancel={() => setEditingProject(null)}
                submitLabel="Renommer"
              />
            ) : null}
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}
