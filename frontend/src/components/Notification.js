// src/components/Notification.js
import { Snackbar, Alert } from '@mui/material';

function Notification({ open, onClose, severity, message }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
export default Notification;
