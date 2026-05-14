import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  userName?: string;
  onLogout?: () => void;
}

export default function HeaderMUI({
  title,
  onMenuClick,
  userName,
  onLogout,
}: HeaderProps) {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1B8C3E' }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700 }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {userName ? (
            <Typography variant="body2" sx={{ color: 'white' }}>
              {userName}
            </Typography>
          ) : null}
          {onLogout ? (
            <Button
              color="inherit"
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
              onClick={onLogout}
            >
              Déconnexion
            </Button>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
