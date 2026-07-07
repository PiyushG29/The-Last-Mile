# The Last Mile

A modern web application built with React, Express, and PostgreSQL.
Test Username: Admin001
Test Password: admin001

## Project Setup

### Prerequisites
- Node.js (v20 or later)
- PostgreSQL (v16 or later)

### Environment Setup
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=your_postgres_connection_string
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
SESSION_SECRET=your_session_secret
```

### Installation
1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

### Development
To start the development server:
```
npm run dev
```

The application will be available at http://localhost:5000

### Building for Production
```
npm run build
```

### Starting Production Server
```
npm run start
```

## Project Structure
- `/client`: Frontend React application
- `/server`: Backend Express server
- `/shared`: Shared types and utilities
- `/public`: Static assets

## Database Management
Using Drizzle ORM for database management:
```
npm run db:push
```

## Deployment

### Deploy to Render

1. Log in to [Render](https://render.com/) and create a new account if you don't have one.

2. Click on "New" and select "Web Service".

3. Connect your GitHub repository.

4. Configure the service:
   - Name: the-last-mile
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

5. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `SESSION_SECRET`: (generate a random string)
   - `DATABASE_URL`: (your PostgreSQL connection string)

6. Click "Create Web Service" and wait for the deployment to complete.

### Deploy with Docker

Alternatively, you can deploy the application using Docker:

```bash
# Build the Docker image
docker build -t the-last-mile .

# Run the container
docker run -p 5000:5000 -e NODE_ENV=production -e DATABASE_URL=your_database_url -e SESSION_SECRET=your_session_secret the-last-mile
```
