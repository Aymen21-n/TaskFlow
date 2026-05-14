import { Navbar, Container, Button, Nav } from 'react-bootstrap';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  userName?: string;
  onLogout?: () => void;
}

export default function HeaderBS({
  title,
  onMenuClick,
  userName,
  onLogout,
}: HeaderProps) {
  return (
    <Navbar bg="success" variant="dark" className="px-3">
      <Container fluid>
        <Button
          variant="outline-light"
          size="sm"
          onClick={onMenuClick}
          className="me-3"
        >
          ☰
        </Button>
        <Navbar.Brand className="ms-3 fw-bold">{title}</Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center gap-3">
          {userName ? (
            <span className="text-light">{userName}</span>
          ) : null}
          {onLogout ? (
            <Button
              variant="outline-light"
              size="sm"
              onClick={onLogout}
            >
              Déconnexion
            </Button>
          ) : null}
        </Nav>
      </Container>
    </Navbar>
  );
}
