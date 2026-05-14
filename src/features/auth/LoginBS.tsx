import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import api from '../../api/axios';

export default function LoginBS() {
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
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <Card.Title className="text-center mb-3" style={{ color: '#1B8C3E' }}>
            TaskFlow
          </Card.Title>
          <p className="text-center text-muted mb-3" style={{ fontSize: '0.9rem' }}>
            Connectez-vous pour accéder à votre espace de gestion de tâches.
          </p>
          {state.error ? (
            <Alert variant="danger" className="mb-3">
              {state.error}
            </Alert>
          ) : null}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              className="w-100"
              style={{ backgroundColor: '#1B8C3E', borderColor: '#1B8C3E' }}
              disabled={state.loading}
            >
              {state.loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
