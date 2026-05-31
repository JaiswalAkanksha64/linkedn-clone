import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import { Box, Paper, Avatar, Typography, Divider } from '@mui/material';
import { db } from '../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    // Fetch posts
    const unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    // Fetch jobs
    const unsubJobs = onSnapshot(collection(db, 'jobs'), (snap) => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubUsers(); unsubPosts(); unsubJobs(); };
  }, []);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(query) ||
    u.email?.toLowerCase().includes(query) ||
    u.headline?.toLowerCase().includes(query) ||
    u.skills?.some(s => s.toLowerCase().includes(query))
  );

  const filteredPosts = posts.filter(p =>
    p.text?.toLowerCase().includes(query)
  );

  const filteredJobs = jobs.filter(j =>
    j.title?.toLowerCase().includes(query) ||
    j.company?.toLowerCase().includes(query) ||
    j.location?.toLowerCase().includes(query)
  );

  return (
    <div style={{ backgroundColor: '#f3f2ef', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ maxWidth: 700, margin: '20px auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Typography variant="h5" fontWeight="bold">
          Search results for: <span style={{ color: '#0a66c2' }}>"{query}"</span>
        </Typography>

        {/* People */}
        {filteredUsers.length > 0 && (
          <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 1 }}>👤 People</Typography>
            <Divider sx={{ marginBottom: 1 }} />
            {filteredUsers.map(user => (
              <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                <Avatar sx={{ backgroundColor: '#0a66c2' }}>
                  {user.name ? user.name[0].toUpperCase() : '?'}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="bold">{user.name || user.email}</Typography>
                  <Typography variant="caption" color="gray">{user.headline}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        )}

        {/* Jobs */}
        {filteredJobs.length > 0 && (
          <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 1 }}>💼 Jobs</Typography>
            <Divider sx={{ marginBottom: 1 }} />
            {filteredJobs.map(job => (
              <Box key={job.id} sx={{ marginBottom: 1 }}>
                <Typography variant="body2" fontWeight="bold">{job.title}</Typography>
                <Typography variant="caption" color="gray">{job.company} — {job.location}</Typography>
              </Box>
            ))}
          </Paper>
        )}

        {/* Posts */}
        {filteredPosts.length > 0 && (
          <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 1 }}>📝 Posts</Typography>
            <Divider sx={{ marginBottom: 1 }} />
            {filteredPosts.map(post => (
              <Box key={post.id} sx={{ marginBottom: 1 }}>
                <Typography variant="body2">{post.text}</Typography>
                <Typography variant="caption" color="gray">by {post.email}</Typography>
              </Box>
            ))}
          </Paper>
        )}

        {/* No results */}
        {filteredUsers.length === 0 && filteredJobs.length === 0 && filteredPosts.length === 0 && (
          <Paper elevation={2} sx={{ padding: 3, borderRadius: 2, textAlign: 'center' }}>
            <Typography color="gray">No results found for "{query}"</Typography>
          </Paper>
        )}

      </Box>
    </div>
  );
}

export default SearchPage;