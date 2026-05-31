import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, Button, TextField, Divider, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { auth, db } from '../../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function Profile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    headline: '',
    location: '',
    about: '',
    company: '',
    education: '',
    skills: []
  });
  const [skillInput, setSkillInput] = useState('');

  // Fetch profile from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
    };
    fetchProfile();
  }, []);

  // Save profile to Firestore
  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        email: user.email
      });
      setEditing(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() !== '') {
      setProfile({ ...profile, skills: [...(profile.skills || []), skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  return (
    <Box sx={{ maxWidth: 700, margin: '20px auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Top Card */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Cover Photo */}
        <Box sx={{ backgroundColor: '#0a66c2', height: 120 }} />

        <Box sx={{ padding: 3, position: 'relative' }}>
          <Avatar sx={{
            width: 80, height: 80,
            backgroundColor: '#fff',
            border: '3px solid white',
            position: 'absolute',
            top: -40,
            color: '#0a66c2',
            fontSize: 36
          }}>
            {profile.name ? profile.name[0].toUpperCase() : '?'}
          </Avatar>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<EditIcon />}
              onClick={() => setEditing(!editing)}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 5 }}>
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Box>

          <Box sx={{ marginTop: 3 }}>
            {editing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Full Name" value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} fullWidth />
                <TextField label="Headline (e.g. Java Developer)" value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })} fullWidth />
                <TextField label="Location" value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })} fullWidth />
                <TextField label="About" value={profile.about} multiline rows={3}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })} fullWidth />
                <TextField label="Current Company" value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })} fullWidth />
                <TextField label="Education" value={profile.education}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })} fullWidth />

                {/* Skills */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField label="Add Skill" value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)} fullWidth />
                  <Button variant="contained" onClick={handleAddSkill}
                    sx={{ backgroundColor: '#0a66c2', borderRadius: 2 }}>Add</Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.skills?.map(skill => (
                    <Chip key={skill} label={skill} onDelete={() => handleRemoveSkill(skill)} />
                  ))}
                </Box>

                <Button variant="contained" onClick={handleSave}
                  sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>
                  Save Profile
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" fontWeight="bold">{profile.name || 'Your Name'}</Typography>
                <Typography variant="body1" color="gray">{profile.headline || 'Your Headline'}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginTop: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: 'gray' }} />
                  <Typography variant="body2" color="gray">{profile.location || 'Your Location'}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#0a66c2', marginTop: 0.5 }}>
                  {auth.currentUser?.email}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* About */}
      {!editing && profile.about && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold">About</Typography>
          <Divider sx={{ marginY: 1 }} />
          <Typography variant="body2">{profile.about}</Typography>
        </Paper>
      )}

      {/* Experience */}
      {!editing && profile.company && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold">Experience</Typography>
          <Divider sx={{ marginY: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkIcon sx={{ color: '#0a66c2' }} />
            <Typography variant="body2">{profile.company}</Typography>
          </Box>
        </Paper>
      )}

      {/* Education */}
      {!editing && profile.education && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold">Education</Typography>
          <Divider sx={{ marginY: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon sx={{ color: '#0a66c2' }} />
            <Typography variant="body2">{profile.education}</Typography>
          </Box>
        </Paper>
      )}

      {/* Skills */}
      {!editing && profile.skills?.length > 0 && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold">Skills</Typography>
          <Divider sx={{ marginY: 1 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {profile.skills.map(skill => (
              <Chip key={skill} label={skill} sx={{ backgroundColor: '#e8f0fe', color: '#0a66c2' }} />
            ))}
          </Box>
        </Paper>
      )}

    </Box>
  );
}

export default Profile;