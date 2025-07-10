# Circles API Documentation

## Overview
The Circles module provides real-time chat functionality for community groups. Users can join different circles based on their interests and chat with other members in real-time using WebSocket connections.

## Default Circles
The system comes with 4 pre-configured circles:
- **joyfulSouls**: A community for happy souls to share joy and positive vibes
- **creativeSouls**: Connect with creative minds and share your artistic journey
- **breakupSupport**: A supportive space for healing and moving forward after breakups
- **feelingRomantic**: Share romantic thoughts and experiences with like-minded people

## REST API Endpoints

### Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### 1. Get All Circles
**GET** `/api/circles`

Returns all available circles with membership status for the authenticated user.

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Circles retrieved successfully",
  "data": [
    {
      "id": "circle_id",
      "name": "joyfulSouls",
      "description": "A community for happy souls to share joy and positive vibes",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "memberCount": 15,
      "isMember": true
    }
  ]
}
```

### 2. Get Circle Details
**GET** `/api/circles/:circleId`

Returns detailed information about a specific circle.

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Circle details retrieved successfully",
  "data": {
    "id": "circle_id",
    "name": "joyfulSouls",
    "description": "A community for happy souls to share joy and positive vibes",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "memberCount": 15,
    "isMember": true
  }
}
```

### 3. Get Circle Members
**GET** `/api/circles/:circleId/members`

Returns all active members of a specific circle.

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Circle members retrieved successfully",
  "data": [
    {
      "id": "member_id",
      "userId": "user_id",
      "circleId": "circle_id",
      "joinedAt": "2024-01-01T00:00:00.000Z",
      "isActive": true,
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "profilePhotoUrl": "https://example.com/photo.jpg"
      }
    }
  ]
}
```

### 4. Join Circle
**POST** `/api/circles/join`

Join a circle. If the user was previously a member, their membership will be reactivated.

**Request Body:**
```json
{
  "circleId": "circle_id"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Successfully joined the circle",
  "data": {
    "id": "member_id",
    "userId": "user_id",
    "circleId": "circle_id",
    "joinedAt": "2024-01-01T00:00:00.000Z",
    "isActive": true,
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePhotoUrl": "https://example.com/photo.jpg"
    }
  }
}
```

### 5. Leave Circle
**POST** `/api/circles/leave`

Leave a circle (soft delete - membership becomes inactive).

**Request Body:**
```json
{
  "circleId": "circle_id"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Successfully left the circle"
}
```

### 6. Get Messages
**GET** `/api/circles/messages?circleId=circle_id&limit=50&offset=0`

Get messages from a specific circle. Only members can view messages.

**Query Parameters:**
- `circleId` (required): ID of the circle
- `limit` (optional): Number of messages to return (default: 50)
- `offset` (optional): Number of messages to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Messages retrieved successfully",
  "data": [
    {
      "id": "message_id",
      "content": "Hello everyone!",
      "userId": "user_id",
      "circleId": "circle_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "profilePhotoUrl": "https://example.com/photo.jpg"
      }
    }
  ]
}
```

### 7. Create Message
**POST** `/api/circles/messages`

Send a message to a circle. Only members can send messages.

**Request Body:**
```json
{
  "content": "Hello everyone!",
  "circleId": "circle_id"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Message sent successfully",
  "data": {
    "id": "message_id",
    "content": "Hello everyone!",
    "userId": "user_id",
    "circleId": "circle_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePhotoUrl": "https://example.com/photo.jpg"
    }
  }
}
```

## WebSocket Events

### Connection
Connect to the WebSocket server with authentication:
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Client Events (Emit)

#### 1. Join Circle
```javascript
socket.emit('join-circle', 'circle_id');
```

#### 2. Leave Circle
```javascript
socket.emit('leave-circle', 'circle_id');
```

#### 3. Send Message
```javascript
socket.emit('send-message', {
  content: 'Hello everyone!',
  circleId: 'circle_id'
});
```

#### 4. Typing Indicator
```javascript
socket.emit('typing', {
  circleId: 'circle_id',
  isTyping: true
});
```

### Server Events (Listen)

#### 1. New Message
```javascript
socket.on('new-message', (message) => {
  console.log('New message:', message);
});
```

#### 2. User Joined Circle
```javascript
socket.on('user-joined-circle', (data) => {
  console.log('User joined:', data);
});
```

#### 3. User Left Circle
```javascript
socket.on('user-left-circle', (data) => {
  console.log('User left:', data);
});
```

#### 4. User Typing
```javascript
socket.on('user-typing', (data) => {
  console.log('User typing:', data);
});
```

#### 5. Error
```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized - No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "statusCode": 403,
  "message": "You must be a member to view messages"
}
```

### 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Circle not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "statusCode": 400,
  "message": "User is already a member of this circle"
}
```

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Generate Prisma Client:**
   ```bash
   pnpm pg
   ```

3. **Push Database Schema:**
   ```bash
   pnpm pm
   ```

4. **Initialize Default Circles:**
   ```bash
   pnpm init-circles
   ```

5. **Start Development Server:**
   ```bash
   pnpm dev
   ```

## Frontend Integration Example

```javascript
// Connect to WebSocket
const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token')
  }
});

// Join a circle
socket.emit('join-circle', 'circle_id');

// Listen for new messages
socket.on('new-message', (message) => {
  // Add message to UI
  addMessageToChat(message);
});

// Send a message
function sendMessage(content, circleId) {
  socket.emit('send-message', { content, circleId });
}

// Show typing indicator
function showTyping(isTyping, circleId) {
  socket.emit('typing', { circleId, isTyping });
}
```

## Security Features

1. **Authentication Required**: All endpoints require valid JWT tokens
2. **Membership Verification**: Only circle members can view/send messages
3. **Real-time Validation**: WebSocket connections validate user membership
4. **Soft Delete**: Users can leave circles without losing message history
5. **Rate Limiting**: Consider implementing rate limiting for message sending

## Performance Considerations

1. **Message Pagination**: Use limit/offset for large message histories
2. **Connection Management**: Properly handle WebSocket disconnections
3. **Database Indexing**: Ensure proper indexes on frequently queried fields
4. **Caching**: Consider caching circle memberships for faster lookups 