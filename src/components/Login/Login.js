import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { auth, db } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('❌ Email and password are required.');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setError('❌ Please verify your email first. Check your inbox!');
        await signOut(auth);
        return;
      }
      // Save user to Firestore if not exists
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: userCredential.user.email,
          name: '',
          headline: '',
          location: '',
          uid: userCredential.user.uid
        });
      }
      // Set displayName from Firestore
      if (userSnap.exists() && userSnap.data().name) {
        await updateProfile(userCredential.user, {
          displayName: userSnap.data().name
        });
      }
      navigate('/home');
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('❌ Invalid email or password. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('❌ No account found. Please create an account first.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('❌ Too many attempts. Please try again later.');
      } else {
        setError('❌ Something went wrong. Please try again.');
      }
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError('❌ Email and password are required.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('❌ Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('❌ Password must be at least 6 characters.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await signOut(auth);
      setError('');
      setVerificationSent(true);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('❌ Email already registered. Please sign in.');
      } else if (err.code === 'auth/invalid-email') {
        setError('❌ Invalid email format.');
      } else {
        setError('❌ Something went wrong. Please try again.');
      }
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f2ef'
    }}>
      <Typography variant="h3" sx={{ color: '#0a66c2', fontWeight: 'bold', marginBottom: 3 }}>
        CampusConnect
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'gray', marginBottom: 2 }}>
        Connect • Learn • Grow
      </Typography>

      <Paper elevation={3} sx={{ padding: 4, width: 350, borderRadius: 2 }}>

        {verificationSent ? (
          <Box sx={{ textAlign: 'center', padding: 2 }}>
            <Typography variant="h6" sx={{ color: '#0a66c2', marginBottom: 1 }}>
              ✅ Verification Email Sent!
            </Typography>
            <Typography variant="body2" color="gray" sx={{ marginBottom: 2 }}>
              Please check your inbox and verify your email before signing in.
            </Typography>
            <Button variant="contained" fullWidth
              onClick={() => { setVerificationSent(false); setError(''); }}
              sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>
              Back to Sign In
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 600 }}>
              Sign in
            </Typography>

            {error && (
              <Box sx={{
                backgroundColor: '#fdecea',
                border: '1px solid #f44336',
                borderRadius: 1,
                padding: '10px 14px',
                marginBottom: 2
              }}>
                <Typography sx={{ color: '#d32f2f', fontSize: 13 }}>{error}</Typography>
              </Box>
            )}

            <TextField label="Email" type="email" fullWidth variant="outlined"
              value={email} onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: 2 }} />

            <TextField label="Password" type="password" fullWidth variant="outlined"
              value={password} onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: 3 }} />

            <Button variant="contained" fullWidth onClick={handleLogin}
              sx={{ backgroundColor: '#0a66c2', borderRadius: 5, marginBottom: 2, padding: 1.5 }}>
              Sign In
            </Button>

            <Button variant="outlined" fullWidth onClick={handleRegister}
              sx={{ borderRadius: 5, padding: 1.5 }}>
              Create Account
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Login;