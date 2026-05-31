import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { db } from '../../firebase/firebase';
import { collection, onSnapshot, orderBy, query} from 'firebase/firestore';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const getIcon = (type) => {
    if (type === 'job') return <WorkIcon sx={{ color: '#0a66c2' }} />;
    if (type === 'connection') return <PeopleIcon sx={{ color: '#0a66c2' }} />;
    if (type === 'like') return <ThumbUpIcon sx={{ color: '#0a66c2' }} />;
    return <NotificationsIcon sx={{ color: '#0a66c2' }} />;
  };

  return (
    <Box sx={{ maxWidth: 700, margin: '20px auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

      <Typography variant="h5" fontWeight="bold">Notifications</Typography>

      {notifications.length === 0 && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography color="gray">No notifications yet!</Typography>
        </Paper>
      )}

      {notifications.map(notif => (
        <Paper key={notif.id} elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ backgroundColor: '#e8f0fe' }}>
              {getIcon(notif.type)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="bold">{notif.message}</Typography>
              <Typography variant="caption" color="gray">
                {notif.timestamp?.toDate().toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ marginTop: 1 }} />
        </Paper>
      ))}

      {/* Sample Notifications for Demo */}
      {notifications.length === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { type: 'connection', message: 'Someone viewed your profile' },
            { type: 'job', message: 'New job matching your profile: Java Developer at TCS' },
            { type: 'like', message: 'Someone liked your post' },
            { type: 'connection', message: 'You have a new connection request' },
          ].map((item, index) => (
            <Paper key={index} elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ backgroundColor: '#e8f0fe' }}>
                  {getIcon(item.type)}
                </Avatar>
                <Typography variant="body2" fontWeight="bold">{item.message}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Notifications;