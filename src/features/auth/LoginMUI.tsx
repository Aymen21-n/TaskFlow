import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useAuth } from './AuthContext';
import api from '../../api/axios';

export default function LoginMUI() {
  const { state, dispatch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || '/dashboard';

  useEffect(() => {
    if (state.user) {
      navigate(from, { replace: true });
    }
  }, [state.user, navigate, from]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    dispatch({ type: 'LOGIN_START' });

    try {
      const users = await api.get(`/users?email=${encodeURIComponent(email)}`);

      if (
        !Array.isArray(users.data) ||
        users.data.length === 0 ||
        users.data[0].password !== password
      ) {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'Email ou mot de passe incorrect',
        });
        return;
      }

      const { password: _, ...user } = users.data[0];
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Erreur serveur' });
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: '#1B8C3E', textAlign: 'center' }}
          >
            TaskFlow
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#888', textAlign: 'center' }}
          >
            Connectez-vous pour accéder à votre espace de gestion de tâches.
          </Typography>
          {state.error ? <Alert severity="error">{state.error}</Alert> : null}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                fullWidth
                type="password"
                label="Mot de passe"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={state.loading}
                sx={{
                  backgroundColor: '#1B8C3E',
                  '&:hover': {
                    backgroundColor: '#157a33',
                  },
                  '&:disabled': {
                    backgroundColor: '#cccccc',
                  },
                }}
              >
                {state.loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
