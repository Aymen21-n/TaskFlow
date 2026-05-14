import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/axios';

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleError(err: unknown) {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message || `Erreur ${err.response?.status}`;
      setError(message);
    } else {
      setError('Erreur inconnue');
    }
  }

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
        handleError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function addProject(name: string, color: string) {
    setError(null);

    try {
      const { data } = await api.post<Project>('/projects', { name, color });
      setProjects((prev) => [...prev, data]);
    } catch (err) {
      handleError(err);
    }
  }

  async function renameProject(project: Project, newName: string) {
    if (newName === '' || newName === project.name) return;

    try {
      const { data } = await api.put<Project>('/projects/' + project.id, {
        ...project,
        name: newName,
      });
      setProjects((prev) => prev.map((p) => (p.id === data.id ? data : p)));
    } catch (err) {
      handleError(err);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Êtes-vous sûr ?')) return;

    try {
      await api.delete('/projects/' + id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      handleError(err);
    }
  }

  return {
    projects,
    columns,
    loading,
    error,
    addProject,
    renameProject,
    deleteProject,
  };
}
