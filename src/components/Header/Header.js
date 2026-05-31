import React, { useState } from 'react';
import { AppBar, Toolbar, InputBase, Avatar, Typography, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import EventIcon from '@mui/icons-material/Event';
import GroupsIcon from '@mui/icons-material/Groups';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const NavItem = ({ icon, label, onClick }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: 60 }}
      onClick={onClick}>
      {icon}
      <Typography variant="caption" sx={{ color: 'gray' }}>{label}</Typography>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>

        {/* Left - Logo + Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" sx={{ color: '#0a66c2', fontWeight: 'bold' }}>in</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#eef3f8', borderRadius: 1, padding: '4px 8px' }}>
            <SearchIcon sx={{ color: 'gray', fontSize: 20 }} />
            <InputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              sx={{ marginLeft: 1, fontSize: 14 }}
            />
          </Box>
        </Box>

        {/* Center - All Nav Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NavItem icon={<HomeIcon sx={{ color: 'gray' }} />} label="Home" onClick={() => navigate('/home')} />
          <NavItem icon={<PeopleIcon sx={{ color: 'gray' }} />} label="Network" onClick={() => navigate('/network')} />
          <NavItem icon={<WorkIcon sx={{ color: 'gray' }} />} label="Jobs" onClick={() => navigate('/jobs')} />
          <NavItem icon={<NotificationsIcon sx={{ color: 'gray' }} />} label="Notifications" onClick={() => navigate('/notifications')} />
          <NavItem icon={<ChatIcon sx={{ color: 'gray' }} />} label="Messaging" onClick={() => navigate('/messaging')} />
          <NavItem icon={<EventIcon sx={{ color: 'gray' }} />} label="Events" onClick={() => navigate('/events')} />
          <NavItem icon={<GroupsIcon sx={{ color: 'gray' }} />} label="Groups" onClick={() => navigate('/groups')} />

          {/* Profile */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50, cursor: 'pointer' }}
            onClick={() => navigate('/profile')}>
            <Avatar sx={{ width: 28, height: 28, backgroundColor: '#0a66c2' }} />
            <Typography variant="caption" sx={{ color: 'gray' }}>Profile</Typography>
          </Box>

          {/* Logout */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50, cursor: 'pointer' }}
            onClick={handleLogout}>
            <Typography sx={{ color: 'gray', fontSize: 22 }}>⏻</Typography>
            <Typography variant="caption" sx={{ color: 'gray' }}>Logout</Typography>
          </Box>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default Header;