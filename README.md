# Chat Hive - Real-Time Chat Application

Chat Hive is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) chat application with real-time messaging capabilities using Socket.IO.

## Features

### Authentication
- User registration with username, email, and password
- Custom avatar upload during registration
- Secure login with JWT authentication
- Profile viewing functionality

### Chat Features
- Real-time one-on-one chat
- Group chat functionality
- Real-time typing indicators
- Message read/unread status
- Chat history persistence

### Group Chat Features
- Create group chats
- Add/remove users from groups
- Rename group chats
- Group admin privileges
- View group members

### User Interface
- Modern responsive design
- Search users functionality
- Sidebar with chat list
- Real-time chat updates
- Profile picture display
- Password visibility toggle

### Security Features
- JWT based authentication
- Password encryption
- Protected routes
- Secure file upload
- Input validation

## Tech Stack

### Frontend
- React.js
- Socket.IO-client
- React Router DOM
- Axios for HTTP requests
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT for authentication
- Bcrypt for password hashing

## Installation

1. Clone the repository
```bash
git clone https://github.com/PreetR24/Chat-Hive
```

2. Install backend dependencies
```bash
cd back-end
npm install
```

3. Install frontend dependencies
```bash
cd front-end
npm install
```

4. Start the servers
```bash
# Start backend server
cd back-end
npm start

# Start frontend server
cd front-end
npm start
```

## Usage

1. Register a new account with email and password
2. Upload a profile picture (optional)
3. Log in with your credentials
4. Search for other users
5. Start one-on-one chats
6. Create group chats
7. Send real-time messages
8. Manage group chat settings

## API Endpoints

### User Routes
- POST `/api/user` - Register new user
- POST `/api/user/login` - User login
- GET `/api/user` - Search users

### Chat Routes
- POST `/api/chat` - Access or create one-on-one chat
- GET `/api/chat` - Get all chats for a user
- POST `/api/chat/group` - Create group chat
- PUT `/api/chat/rename` - Rename group chat
- PUT `/api/chat/groupadd` - Add user to group
- PUT `/api/chat/groupremove` - Remove user from group

### Message Routes
- GET `/api/message/:chatId` - Get all messages for a chat
- POST `/api/message` - Send a new message
