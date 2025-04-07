
## Docker Setup Guide

This section provides instructions for setting up and running the DailyNotes application locally using Docker Compose.

## Prerequisites

Make sure you have the following installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

1. ### Clone the Repository:

   Clone this repository to your local machine using the following command:

   ```bash
   git clone https://github.com/alikhere/DailyNotes
   ```

2. ### Set up environment variables:
    Navigate to the server directory:
    ```bash
    cd DailyNotes/server
    ```
    Copy the environment file:
    ```bash
    cp .env.example .env
    ```
    Open the newly created .env file and provide values for the following:
   - MONGO_URI=your_mongodb_connection_string
   - JWT_SECRET=your_jwt_secret
  
    Back to root directory:
    ```sh
    cd ..
    ```

3. ### Launch the app:
    Navigate to the clien directory:
    ```bash
    docker-compose up --build
    ```
    - The React app should now be running at: [http://localhost:5173](http://localhost:5173)

    Stopping the App
    ```sh
    docker-compose down
    ```
    Remove volumes
    ```sh
    docker-compose down -v
    ```