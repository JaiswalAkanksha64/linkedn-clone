import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, TextField, Divider, Chip, Avatar } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import { db, auth } from '../../firebase/firebase';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '', company: '', location: '', type: '', description: ''
  });

  // Fetch jobs from Firestore
  useEffect(() => {
    const q = query(collection(db, 'jobs'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Post new job
  const handlePostJob = async () => {
    if (newJob.title.trim() === '') return;
    await addDoc(collection(db, 'jobs'), {
      ...newJob,
      postedBy: auth.currentUser?.email,
      timestamp: serverTimestamp()
    });
    setNewJob({ title: '', company: '', location: '', type: '', description: '' });
    setShowForm(false);
  };

  // Apply to job
  const handleApply = (jobId) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, margin: '20px auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">Job Postings</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setShowForm(!showForm)}
          sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>
          Post a Job
        </Button>
      </Box>

      {/* Post Job Form */}
      {showForm && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>Post a New Job</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Job Title" fullWidth value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
            <TextField label="Company Name" fullWidth value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} />
            <TextField label="Location" fullWidth value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
            <TextField label="Job Type (Full-time/Internship/Part-time)" fullWidth value={newJob.type}
              onChange={(e) => setNewJob({ ...newJob, type: e.target.value })} />
            <TextField label="Job Description" fullWidth multiline rows={3} value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
            <Button variant="contained" onClick={handlePostJob}
              sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>
              Submit Job
            </Button>
          </Box>
        </Paper>
      )}

      {/* Jobs List */}
      {jobs.length === 0 && (
        <Paper elevation={2} sx={{ padding: 3, borderRadius: 2, textAlign: 'center' }}>
          <Typography color="gray">No jobs posted yet. Be the first to post!</Typography>
        </Paper>
      )}

      {jobs.map(job => (
        <Paper key={job.id} elevation={2} sx={{ padding: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar sx={{ backgroundColor: '#0a66c2', width: 50, height: 50 }}>
              <WorkIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">{job.title}</Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BusinessIcon sx={{ fontSize: 16, color: 'gray' }} />
                <Typography variant="body2" color="gray">{job.company}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: 'gray' }} />
                <Typography variant="body2" color="gray">{job.location}</Typography>
              </Box>

              {job.type && (
                <Chip label={job.type} size="small"
                  sx={{ marginTop: 1, backgroundColor: '#e8f0fe', color: '#0a66c2' }} />
              )}

              <Divider sx={{ marginY: 1 }} />

              <Typography variant="body2" color="gray">{job.description}</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <Typography variant="caption" color="gray">
                  Posted by: {job.postedBy}
                </Typography>
                <Button
                  variant={appliedJobs.includes(job.id) ? "outlined" : "contained"}
                  size="small"
                  onClick={() => handleApply(job.id)}
                  sx={{
                    borderRadius: 5,
                    backgroundColor: appliedJobs.includes(job.id) ? 'transparent' : '#0a66c2',
                    color: appliedJobs.includes(job.id) ? '#0a66c2' : 'white'
                  }}>
                  {appliedJobs.includes(job.id) ? '✓ Applied' : 'Easy Apply'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default Jobs;