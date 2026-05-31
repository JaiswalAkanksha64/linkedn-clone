import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, Button, TextField, Divider, Chip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { db, auth } from '../../firebase/firebase';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

function Events() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '', location: '', date: '', description: '', type: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handlePostEvent = async () => {
    if (newEvent.title.trim() === '') return;
    await addDoc(collection(db, 'events'), {
      ...newEvent,
      postedBy: auth.currentUser?.email,
      timestamp: serverTimestamp()
    });
    setNewEvent({ title: '', location: '', date: '', description: '', type: '' });
    setShowForm(false);
  };

  const handleAttend = (eventId) => {
    if (!attendingEvents.includes(eventId)) {
      setAttendingEvents([...attendingEvents, eventId]);
    } else {
      setAttendingEvents(attendingEvents.filter(id => id !== eventId));
    }
  };

  return (
    <Box sx={{ maxWidth: 700, margin: '20px auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">Events</Typography>
        <Button startIcon={<AddIcon />} variant="contained"
          onClick={() => setShowForm(!showForm)}
          sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>
          Create Event
        </Button>
      </Box>

      {/* Create Event Form */}
      {showForm && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>Create New Event</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Event Title" fullWidth value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
            <TextField label="Location (Online/Offline)" fullWidth value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
            <TextField label="Date & Time" type="datetime-local" fullWidth
              value={newEvent.date} InputLabelProps={{ shrink: true }}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
            <TextField label="Event Type (Webinar/Workshop/Meetup)" fullWidth value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })} />
            <TextField label="Description" fullWidth multiline rows={3} value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
            <Button variant="contained" onClick={handlePostEvent}
              sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>
              Create Event
            </Button>
          </Box>
        </Paper>
      )}

      {/* Events List */}
      {events.length === 0 && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography color="gray">No events yet. Create one!</Typography>
        </Paper>
      )}

      {events.map(event => (
        <Paper key={event.id} elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar sx={{ backgroundColor: '#0a66c2', width: 50, height: 50 }}>
              <EventIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">{event.title}</Typography>

              {event.type && (
                <Chip label={event.type} size="small"
                  sx={{ marginBottom: 1, backgroundColor: '#e8f0fe', color: '#0a66c2' }} />
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: 'gray' }} />
                <Typography variant="body2" color="gray">{event.date}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: 'gray' }} />
                <Typography variant="body2" color="gray">{event.location}</Typography>
              </Box>

              <Divider sx={{ marginY: 1 }} />
              <Typography variant="body2" color="gray">{event.description}</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <Typography variant="caption" color="gray">
                  Organized by: {event.postedBy}
                </Typography>
                <Button
                  variant={attendingEvents.includes(event.id) ? "outlined" : "contained"}
                  size="small"
                  onClick={() => handleAttend(event.id)}
                  sx={{
                    borderRadius: 5,
                    backgroundColor: attendingEvents.includes(event.id) ? 'transparent' : '#0a66c2',
                    color: attendingEvents.includes(event.id) ? '#0a66c2' : 'white'
                  }}>
                  {attendingEvents.includes(event.id) ? '✓ Attending' : 'Attend'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default Events;