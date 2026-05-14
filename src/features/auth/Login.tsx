import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import type { RootState } from '../../store';
import { loginFailure, loginStart, loginSuccess } from './authSlice';
import styles from './Login.module.css';

export default function Login() {
  const dispatch = useDispatch();
  const { user: authUser, loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || '/dashboard';

  useEffect(() => {
    if (authUser) {
      navigate(from, { replace: true });
    }
  }, [authUser, navigate, from]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    dispatch(loginStart());

    try {
      const users = await api.get(`/users?email=${encodeURIComponent(email)}`);

      if (!Array.isArray(users.data) || users.data.length === 0 || users.data[0].password !== password) {
        dispatch(loginFailure('Email ou mot de passe incorrect'));
        return;
      }

      const { password: _, ...user } = users.data[0];
      const fakeToken = btoa(
        JSON.stringify({
          userId: user.id,
          email: user.email,
          role: 'admin',
          exp: Date.now() + 3600000,
        })
      );
      dispatch(loginSuccess({ user, token: fakeToken }));
    } catch (error) {
      dispatch(loginFailure('Erreur serveur'));
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>TaskFlow</h1>
        <p className={styles.subtitle}>Connectez-vous pour accéder à votre espace de gestion de tâches.</p>
        {error ? <div className={styles.error}>{error}</div> : null}
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

