import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, Button, Divider, Chip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import { db, auth } from '../../firebase/firebase';
import { collection, onSnapshot, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

function Network() {
  const [users, setUsers] = useState([]);
  const [myConnections, setMyConnections] = useState([]);
  const [pendingSent, setPendingSent] = useState([]);
  const [pendingReceived, setPendingReceived] = useState([]);

  // Fetch all users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const allUsers = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== auth.currentUser?.uid);
      setUsers(allUsers);
    });
    return () => unsubscribe();
  }, []);

  // Fetch my connection data
  useEffect(() => {
    const fetchMyConnections = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'connections', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMyConnections(docSnap.data().connected || []);
          setPendingSent(docSnap.data().pendingSent || []);
          setPendingReceived(docSnap.data().pendingReceived || []);
        }
      }
    };
    fetchMyConnections();

    // Realtime listener
    const user = auth.currentUser;
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'connections', user.uid), (snap) => {
        if (snap.exists()) {
          setMyConnections(snap.data().connected || []);
          setPendingSent(snap.data().pendingSent || []);
          setPendingReceived(snap.data().pendingReceived || []);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Send connection request
  const handleConnect = async (targetUid) => {
    const user = auth.currentUser;
    if (!user) return;

    // Update my pendingSent
    await setDoc(doc(db, 'connections', user.uid), {
      connected: myConnections,
      pendingSent: [...pendingSent, targetUid],
      pendingReceived: pendingReceived
    }, { merge: true });

    // Update target's pendingReceived
    await setDoc(doc(db, 'connections', targetUid), {
      pendingReceived: arrayUnion(user.uid)
    }, { merge: true });
  };

  // Accept connection request
  const handleAccept = async (targetUid) => {
    const user = auth.currentUser;
    if (!user) return;

    // Update my connections
    await setDoc(doc(db, 'connections', user.uid), {
      connected: arrayUnion(targetUid),
      pendingReceived: pendingReceived.filter(id => id !== targetUid),
      pendingSent: pendingSent
    }, { merge: true });

    // Update target's connections
    await setDoc(doc(db, 'connections', targetUid), {
      connected: arrayUnion(user.uid),
      pendingSent: arrayRemove(user.uid)
    }, { merge: true });
  };

  // Withdraw/Remove connection
  const handleWithdraw = async (targetUid) => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, 'connections', user.uid), {
      pendingSent: pendingSent.filter(id => id !== targetUid)
    });

    await updateDoc(doc(db, 'connections', targetUid), {
      pendingReceived: arrayRemove(user.uid)
    });
  };

  const getStatus = (userId) => {
    if (myConnections.includes(userId)) return 'connected';
    if (pendingSent.includes(userId)) return 'sent';
    if (pendingReceived.includes(userId)) return 'received';
    return 'none';
  };

  const connectedUsers = users.filter(u => myConnections.includes(u.id));
  const pendingReceivedUsers = users.filter(u => pendingReceived.includes(u.id));
  const suggestedUsers = users.filter(u => getStatus(u.id) === 'none');

  return (
    <Box sx={{ maxWidth: 700, margin: '20px auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

      <Typography variant="h5" fontWeight="bold">My Network</Typography>

      {/* Pending Requests Received */}
      {pendingReceivedUsers.length > 0 && (
        <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ marginBottom: 1 }}>
            📬 Connection Requests ({pendingReceivedUsers.length})
          </Typography>
          {pendingReceivedUsers.map(user => (
            <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ backgroundColor: '#0a66c2' }}>
                  {user.name ? user.name[0].toUpperCase() : user.email?.[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="bold">{user.name || user.email}</Typography>
                  <Typography variant="caption" color="gray">{user.headline || ''}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small"
                  onClick={() => handleAccept(user.id)}
                  sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>
                  Accept
                </Button>
                <Button variant="outlined" size="small"
                  onClick={() => handleWithdraw(user.id)}
                  sx={{ borderRadius: 5 }}>
                  Ignore
                </Button>
              </Box>
            </Box>
          ))}
        </Paper>
      )}

      {/* Connected */}
      {connectedUsers.length > 0 && (
        <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ marginBottom: 1, color: '#0a66c2' }}>
            <PeopleIcon sx={{ fontSize: 18, marginRight: 0.5 }} />
            Connections ({connectedUsers.length})
          </Typography>
          {connectedUsers.map(user => (
            <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
              <Avatar sx={{ backgroundColor: '#0a66c2' }}>
                {user.name ? user.name[0].toUpperCase() : user.email?.[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold">{user.name || user.email}</Typography>
                <Typography variant="caption" color="gray">{user.headline || ''}</Typography>
              </Box>
              <Chip label="Connected" size="small" sx={{ marginLeft: 'auto', backgroundColor: '#e8f0fe', color: '#0a66c2' }} />
            </Box>
          ))}
        </Paper>
      )}

      {/* People you may know */}
      <Typography variant="subtitle1" fontWeight="bold" color="gray">
        People you may know
      </Typography>

      {suggestedUsers.length === 0 && pendingReceivedUsers.length === 0 && connectedUsers.length === 0 && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography color="gray">No other users yet!</Typography>
        </Paper>
      )}

      {suggestedUsers.map(user => (
        <Paper key={user.id} elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ backgroundColor: '#0a66c2', width: 50, height: 50 }}>
                {user.name ? user.name[0].toUpperCase() : user.email?.[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.name || user.email}
                </Typography>
                <Typography variant="body2" color="gray">{user.headline || ''}</Typography>
                <Typography variant="caption" color="gray">{user.location || ''}</Typography>
              </Box>
            </Box>

            {getStatus(user.id) === 'sent' ? (
              <Button variant="outlined" size="small"
                onClick={() => handleWithdraw(user.id)}
                sx={{ borderRadius: 5, color: 'gray' }}>
                Pending ✕
              </Button>
            ) : (
              <Button variant="outlined" size="small"
                startIcon={<PersonAddIcon />}
                onClick={() => handleConnect(user.id)}
                sx={{ borderRadius: 5, color: '#0a66c2' }}>
                Connect
              </Button>
            )}
          </Box>
          <Divider sx={{ marginTop: 2 }} />
          {user.skills?.length > 0 && (
            <Typography variant="caption" color="gray" sx={{ marginTop: 1 }}>
              Skills: {user.skills.join(', ')}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
}

export default Network;