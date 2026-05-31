import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, TextField, Button, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { db, auth } from '../../firebase/firebase';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

function Messaging() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (newMessage.trim() === '') return;
    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      sender: auth.currentUser?.email,
      timestamp: serverTimestamp()
    });
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const isMyMessage = (sender) => sender === auth.currentUser?.email;

  return (
    <Box sx={{ maxWidth: 700, margin: '20px auto' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>Messaging</Typography>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>

        {/* Messages Area */}
        <Box sx={{
          height: 450,
          overflowY: 'auto',
          padding: 2,
          backgroundColor: '#f3f2ef',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', marginTop: 10 }}>
              <Typography color="gray">No messages yet. Start a conversation!</Typography>
            </Box>
          )}

          {messages.map(msg => (
            <Box key={msg.id} sx={{
              display: 'flex',
              justifyContent: isMyMessage(msg.sender) ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 1
            }}>
              {!isMyMessage(msg.sender) && (
                <Avatar sx={{ width: 30, height: 30, backgroundColor: '#0a66c2', fontSize: 14 }}>
                  {msg.sender?.[0]?.toUpperCase()}
                </Avatar>
              )}

              <Box sx={{
                maxWidth: '65%',
                backgroundColor: isMyMessage(msg.sender) ? '#0a66c2' : 'white',
                color: isMyMessage(msg.sender) ? 'white' : 'black',
                padding: '8px 14px',
                borderRadius: isMyMessage(msg.sender) ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                boxShadow: 1
              }}>
                {!isMyMessage(msg.sender) && (
                  <Typography variant="caption" sx={{ color: '#0a66c2', fontWeight: 'bold' }}>
                    {msg.sender}
                  </Typography>
                )}
                <Typography variant="body2">{msg.text}</Typography>
                <Typography variant="caption" sx={{
                  opacity: 0.7,
                  fontSize: 10,
                  display: 'block',
                  textAlign: 'right'
                }}>
                  {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>

              {isMyMessage(msg.sender) && (
                <Avatar sx={{ width: 30, height: 30, backgroundColor: '#0a66c2', fontSize: 14 }}>
                  {msg.sender?.[0]?.toUpperCase()}
                </Avatar>
              )}
            </Box>
          ))}
        </Box>

        <Divider />

        {/* Input Area */}
        <Box sx={{ display: 'flex', padding: 2, gap: 1, backgroundColor: 'white' }}>
          <TextField
            fullWidth
            placeholder="Write a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 5 } }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            sx={{ backgroundColor: '#0a66c2', borderRadius: 5, minWidth: 50 }}>
            <SendIcon />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Messaging;