import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, TextField, Button, Divider, Typography, Modal } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ArticleIcon from '@mui/icons-material/Article';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
import { db, auth } from '../../firebase/firebase';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, doc, arrayUnion,deleteDoc } from 'firebase/firestore';


function Feed() {
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [activeComment, setActiveComment] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async (type = 'text') => {
    if (postText.trim() === '' && type === 'text') return;
    await addDoc(collection(db, 'posts'), {
      text: postText,
      type: type,
      mediaUrl: mediaUrl || null,
      articleTitle: articleTitle || null,
      email: auth.currentUser?.email,
      likes: [],
      comments: [],
      timestamp: serverTimestamp()
    });
    setPostText('');
    setMediaUrl('');
    setArticleTitle('');
    setModalType(null);
  };

  const handleLike = async (postId, currentLikes) => {
    const userEmail = auth.currentUser?.email;
    const postRef = doc(db, 'posts', postId);
    if (currentLikes?.includes(userEmail)) {
      await updateDoc(postRef, {
        likes: currentLikes.filter(e => e !== userEmail)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userEmail)
      });
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: arrayUnion({
        email: auth.currentUser?.email,
        text: commentText,
        time: new Date().toLocaleString()
      })
    });
    setCommentText('');
    setActiveComment(null);
  };

  const handleDelete = async (postId, postEmail) => {
    if (postEmail !== auth.currentUser?.email) return;
    await deleteDoc(doc(db, 'posts', postId));
  };

  // Modal Style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '20px auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Post Input Box */}
      <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
          <Avatar sx={{ backgroundColor: '#0a66c2' }} />
          <TextField fullWidth placeholder="Start a post..." multiline rows={2}
            value={postText} onChange={(e) => setPostText(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 5 } }} />
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 1 }}>
          <Button startIcon={<ImageIcon sx={{ color: '#70b5f9' }} />}
            sx={{ color: 'gray' }} onClick={() => setModalType('photo')}>Photo</Button>
          <Button startIcon={<VideoCallIcon sx={{ color: '#7fc15e' }} />}
            sx={{ color: 'gray' }} onClick={() => setModalType('video')}>Video</Button>
          <Button startIcon={<ArticleIcon sx={{ color: '#e7a33e' }} />}
            sx={{ color: 'gray' }} onClick={() => setModalType('article')}>Article</Button>
          <Button variant="contained" onClick={() => handlePost('text')}
            sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>Post</Button>
        </Box>
      </Paper>

      {/* Photo Modal */}
      <Modal open={modalType === 'photo'} onClose={() => setModalType(null)}>
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <Typography variant="h6">Add Photo</Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => setModalType(null)} />
          </Box>
          <TextField fullWidth label="Image URL (paste imgur or any image link)"
            value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)}
            sx={{ marginBottom: 2 }} />
          <TextField fullWidth multiline rows={3} placeholder="Write something about this photo..."
            value={postText} onChange={(e) => setPostText(e.target.value)}
            sx={{ marginBottom: 2 }} />
          {mediaUrl && (
            <Box sx={{ marginBottom: 2 }}>
              <img src={mediaUrl} alt="preview" style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }} />
            </Box>
          )}
          <Button fullWidth variant="contained" onClick={() => handlePost('photo')}
            sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>Post Photo</Button>
        </Box>
      </Modal>

      {/* Video Modal */}
      <Modal open={modalType === 'video'} onClose={() => setModalType(null)}>
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <Typography variant="h6">Add Video</Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => setModalType(null)} />
          </Box>
          <TextField fullWidth label="YouTube Video URL"
            value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)}
            sx={{ marginBottom: 2 }} />
          <TextField fullWidth multiline rows={3} placeholder="Write something about this video..."
            value={postText} onChange={(e) => setPostText(e.target.value)}
            sx={{ marginBottom: 2 }} />
          <Button fullWidth variant="contained" onClick={() => handlePost('video')}
            sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>Post Video</Button>
        </Box>
      </Modal>

      {/* Article Modal */}
      <Modal open={modalType === 'article'} onClose={() => setModalType(null)}>
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <Typography variant="h6">Write Article</Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => setModalType(null)} />
          </Box>
          <TextField fullWidth label="Article Title"
            value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)}
            sx={{ marginBottom: 2 }} />
          <TextField fullWidth multiline rows={6} placeholder="Write your article..."
            value={postText} onChange={(e) => setPostText(e.target.value)}
            sx={{ marginBottom: 2 }} />
          <Button fullWidth variant="contained" onClick={() => handlePost('article')}
            sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>Publish Article</Button>
        </Box>
      </Modal>

      {/* Posts List */}
      {posts.map(post => (
        <Paper key={post.id} elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
            <Avatar sx={{ backgroundColor: '#0a66c2', width: 40, height: 40 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">{post.email}</Typography>
              <Typography variant="caption" color="gray">
                {post.timestamp?.toDate().toLocaleString()}
              </Typography>
            </Box>
            {post.email === auth.currentUser?.email && (
              <Button
                size="small"
                onClick={() => handleDelete(post.id, post.email)}
                sx={{ color: 'red', minWidth: 'auto' }}>
                🗑️
              </Button>
            )}
          </Box>
          {/* Article Title */}
          {post.articleTitle && (
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 1 }}>
              {post.articleTitle}
            </Typography>
          )}

          <Typography variant="body2" sx={{ marginBottom: 1 }}>{post.text}</Typography>

          {/* Photo */}
          {post.type === 'photo' && post.mediaUrl && (
            <Box sx={{ marginBottom: 1 }}>
              <img src={post.mediaUrl} alt="post" style={{ width: '100%', borderRadius: 8, maxHeight: 300, objectFit: 'cover' }} />
            </Box>
          )}

          {/* Video */}
          {post.type === 'video' && post.mediaUrl && (
            <Box sx={{ marginBottom: 1 }}>
              <iframe
                width="100%" height="250"
                src={post.mediaUrl.replace('watch?v=', 'embed/')}
                title="video" frameBorder="0" allowFullScreen
                style={{ borderRadius: 8 }}
              />
            </Box>
          )}

          <Divider sx={{ marginY: 1 }} />

          {/* Like + Comment */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<ThumbUpIcon sx={{ color: post.likes?.includes(auth.currentUser?.email) ? '#0a66c2' : 'gray' }} />}
              sx={{ color: post.likes?.includes(auth.currentUser?.email) ? '#0a66c2' : 'gray' }}
              onClick={() => handleLike(post.id, post.likes)}>
              {post.likes?.length || 0} Like
            </Button>
            <Button startIcon={<CommentIcon sx={{ color: 'gray' }} />}
              sx={{ color: 'gray' }}
              onClick={() => setActiveComment(activeComment === post.id ? null : post.id)}>
              {post.comments?.length || 0} Comment
            </Button>
          </Box>

          {/* Comments Section */}
          {activeComment === post.id && (
            <Box sx={{ marginTop: 1 }}>
              {post.comments?.map((c, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1, marginBottom: 1 }}>
                  <Avatar sx={{ width: 28, height: 28, backgroundColor: '#0a66c2', fontSize: 12 }}>
                    {c.email?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ backgroundColor: '#f3f2ef', borderRadius: 2, padding: '4px 10px' }}>
                    <Typography variant="caption" fontWeight="bold">{c.email}</Typography>
                    <Typography variant="body2">{c.text}</Typography>
                  </Box>
                </Box>
              ))}
              <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                <TextField fullWidth size="small" placeholder="Add a comment..."
                  value={commentText} onChange={(e) => setCommentText(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 5 } }} />
                <Button variant="contained" size="small"
                  onClick={() => handleComment(post.id)}
                  sx={{ backgroundColor: '#0a66c2', borderRadius: 5 }}>
                  Post
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );
}

export default Feed;