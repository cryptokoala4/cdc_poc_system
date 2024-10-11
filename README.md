# POS Restaurant System

This is a simple Point of Sale (POS) system designed for restaurants, built with a NestJS backend and a Next.js frontend. It uses MongoDB Atlas for data storage and Docker for containerization.

## Technology Stack

- Frontend: Next.js 14, Apollo Client, Zustand, TailwindCSS
- Backend: NestJS, GraphQL
- Database: MongoDB Atlas
- Containerization: Docker

## Features

- **Table Management**: View and manage restaurant tables, including occupancy status.
- **Order Management**: Create, update, and track orders for each table.
- **Bill Generation**: Generate bills for tables and process payments.
- **Temporary Hardcoded data**: The following data is seeded into the database: 10 Menu Items, 5 Staff, 16 Tables

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed Docker and Docker Compose on your machine.
- You have obtained a MongoDB Atlas connection string from the repository owner.

## Running the Application with Docker

1. Clone the repository:
cd pos-restaurant-system

2. In the root directory, rename `.env.example` to `.env` file and update the value of MONGODB_URI
- Note: You need to request a MongoDB Atlas connection string from the repository owner for MONGODB_URI

3. From the root directory, build the Docker images:
  `docker-compose build`

4. Start the containers:
docker-compose up

5. Access the application:
- Frontend: Open your browser and go to `http://localhost:3001`
- GraphQL Playground: Available at `http://localhost:3001/graphql`

## Stopping the Application

To stop the application, use the following command in the terminal from the root directory:
docker-compose down

## Development

If you want to run the application in development mode:

1. Install dependencies for both frontend and backend:
- `cd backend && npm install`
- `cd ../frontend && npm install`

2. Start the backend (from the `backend` directory):
npm run start:dev

3. In a new terminal, start the frontend (from the `frontend` directory):
npm run dev

4. Access the application:
- Frontend: `http://localhost:8080`
- Backend GraphQL Playground: `http://localhost:3000/graphql`

Remember to set up your `.env` file in both the `backend` and `frontend` directories with the necessary environment variables for development mode. The `.env` in `backend` uses the same as the one from your project root directory, and `frontend` currently does not require a `.env` file. 