import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, Button, TextField, Divider, Chip } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AddIcon from '@mui/icons-material/Add';
import { db, auth } from '../../firebase/firebase';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ title: '', description: '', category: '' });

  useEffect(() => {
    const q = query(collection(db, 'groups'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleCreateGroup = async () => {
    if (newGroup.title.trim() === '') return;
    await addDoc(collection(db, 'groups'), {
      ...newGroup,
      createdBy: auth.currentUser?.email,
      members: 1,
      timestamp: serverTimestamp()
    });
    setNewGroup({ title: '', description: '', category: '' });
    setShowForm(false);
  };

  const handleJoin = (groupId) => {
    if (!joinedGroups.includes(groupId)) {
      setJoinedGroups([...joinedGroups, groupId]);
    } else {
      setJoinedGroups(joinedGroups.filter(id => id !== groupId));
    }
  };

  return (
    <Box sx={{ maxWidth: 700, margin: '20px auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">Groups</Typography>
        <Button startIcon={<AddIcon />} variant="contained"
          onClick={() => setShowForm(!showForm)}
          sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>
          Create Group
        </Button>
      </Box>

      {showForm && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>Create New Group</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Group Name" fullWidth value={newGroup.title}
              onChange={(e) => setNewGroup({ ...newGroup, title: e.target.value })} />
            <TextField label="Category (Tech/Business/Education)" fullWidth value={newGroup.category}
              onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })} />
            <TextField label="Description" fullWidth multiline rows={3} value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} />
            <Button variant="contained" onClick={handleCreateGroup}
              sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>
              Create Group
            </Button>
          </Box>
        </Paper>
      )}

      {groups.length === 0 && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography color="gray">No groups yet. Create one!</Typography>
        </Paper>
      )}

      {groups.map(group => (
        <Paper key={group.id} elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar sx={{ backgroundColor: '#0a66c2', width: 50, height: 50 }}>
              <GroupsIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">{group.title}</Typography>
              {group.category && (
                <Chip label={group.category} size="small"
                  sx={{ marginBottom: 1, backgroundColor: '#e8f0fe', color: '#0a66c2' }} />
              )}
              <Typography variant="body2" color="gray">{group.description}</Typography>
              <Divider sx={{ marginY: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="gray">
                  Created by: {group.createdBy}
                </Typography>
                <Button
                  variant={joinedGroups.includes(group.id) ? "outlined" : "contained"}
                  size="small"
                  onClick={() => handleJoin(group.id)}
                  sx={{
                    borderRadius: 5,
                    backgroundColor: joinedGroups.includes(group.id) ? 'transparent' : '#0a66c2',
                    color: joinedGroups.includes(group.id) ? '#0a66c2' : 'white'
                  }}>
                  {joinedGroups.includes(group.id) ? '✓ Joined' : 'Join Group'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default Groups;