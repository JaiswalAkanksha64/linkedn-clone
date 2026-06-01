# Professional Networking Platform

## Live Demo
🔗 **https://teal-cobbler-3049f0.netlify.app**


## Project Title
Unavailability of a Professional Networking Platform for Higher Education Students for Continuous Professional Development


---

## Tech Stack
- **Frontend:** ReactJS, Material UI
- **Backend:** Firebase (Auth + Firestore)
- **Deployment:** Netlify

---

## Features
- ✅ User Authentication (Register, Login, Logout)
- ✅ Email Verification
- ✅ News Feed (Post, Like, Comment, Delete)
- ✅ Photo/Video/Article Posts
- ✅ User Profile (Edit, Save)
- ✅ Job Postings (Post, Apply)
- ✅ Network/Connections (Send, Accept, Ignore)
- ✅ Notifications
- ✅ Messaging (Realtime)
- ✅ Events (Create, Attend)
- ✅ Groups (Create, Join)
- ✅ Search (People, Jobs, Posts)
- ✅ Protected Routes
- ✅ Firestore Security Rules

---

## Setup Instructions

### Prerequisites
- Node.js installed
- Firebase account

### Installation
```bash
git clone https://github.com/JaiswalAkanksha64/linkedin-clone.git
cd linkedin-clone
npm install
npm start
```

### Firebase Setup
1. Create Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Copy config to `src/firebase/firebase.js`

### Deployment
```bash
npm run build
```
Deploy `build` folder to Netlify

---

## Project Structure
src/
├── components/                           
│   ├── Login/                              
│   ├── Header/                          
│   ├── Feed/            
│   ├── Profile/             
│   ├── Jobs/                
│   ├── Network/                     
│   ├── Notifications/             
│   ├── Messaging/                 
│   ├── Events/            
│   ├── Groups/                 
│   └── ProtectedRoute.js              
├── pages/             
│   ├── Home.js                   
│   ├── ProfilePage.js             
│   ├── JobsPage.js            
│   ├── NetworkPage.js                 
│   ├── NotificationsPage.js            
│   ├── MessagingPage.js            
│   ├── EventsPage.js                
│   ├── GroupsPage.js               
│   └── SearchPage.js                 
└── firebase/                 
└── firebase.js                   

---

