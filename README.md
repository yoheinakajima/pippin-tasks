# Pippin Tasks

A comprehensive API-based task management system designed for AI agents and teams, featuring advanced real-time monitoring, robust performance metrics tracking, and dynamic task tracking functionalities.

## Features

- 📋 **Task Management**
  - Create, update, and delete tasks
  - Real-time status updates via WebSocket
  - Priority and assignment tracking
  - Task status visualization

- 🧪 **API Testing Dashboard**
  - Interactive API request builder
  - Response viewer with syntax highlighting
  - Historical test results tracking
  - Support for all HTTP methods

- 📊 **Performance Metrics**
  - Real-time API response time tracking
  - Error rate monitoring
  - Endpoint performance visualization
  - Request volume analytics

## Tech Stack

- **Frontend**
  - React.js with TypeScript
  - TanStack Query for data fetching
  - Recharts for data visualization
  - Tailwind CSS with shadcn/ui components
  - WebSocket for real-time updates

- **Backend**
  - Express.js
  - PostgreSQL database
  - Drizzle ORM
  - WebSocket server
  - Performance metrics middleware

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/pippinlovesyou/pippin-tasks.git
   cd pippin-tasks
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   # Create a PostgreSQL database and set the DATABASE_URL environment variable
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Tasks

```typescript
// Task schema
interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### API Tests

```typescript
// API Test schema
interface ApiTest {
  id: number;
  endpoint: string;
  method: string;
  requestBody?: string;
  responseStatus: number;
  responseBody?: string;
  createdAt: Date;
}
```

#### Endpoints

- `GET /api/tests` - Get all API tests
- `POST /api/tests` - Create a new API test

### Metrics

```typescript
// Metric schema
interface Metric {
  id: number;
  endpoint: string;
  method: string;
  responseTime: number;
  responseStatus: number;
  timestamp: Date;
}
```

#### Endpoints

- `GET /api/metrics` - Get performance metrics

## Real-time Updates

The application uses WebSocket connections for real-time updates. The WebSocket server broadcasts task changes to all connected clients, ensuring that the UI stays synchronized with the latest data.

## Development Guidelines

- Follow the established code structure and patterns
- Use TypeScript for type safety
- Keep the components modular and reusable
- Add appropriate error handling
- Write clear commit messages
- Update documentation when adding new features

## Screenshots

### Task Dashboard
![Task Dashboard](screenshots/task-dashboard.png)

### API Test Dashboard
![API Test Dashboard](screenshots/api-test-dashboard.png)

### Metrics Dashboard
![Metrics Dashboard](screenshots/metrics-dashboard.png)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ by the Pippin team
- Special thanks to all contributors
