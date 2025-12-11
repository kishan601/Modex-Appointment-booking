import React from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import { useUI } from '../../context/UIContext';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useUI();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ position: 'relative', top: 'auto', right: 'auto' }}
        >
          <Alert
            severity={notification.type}
            onClose={() => removeNotification(notification.id)}
            sx={{ minWidth: 300 }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default NotificationContainer;
