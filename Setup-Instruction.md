# Setup Instructions

This section provides instructions for setting up and running the project on a local machine.

1. ### Clone the Repository:

   Clone this repository to your local machine using the following command:

   ```bash
   git clone https://github.com/alikhere/DailyNotes
   ```

2. ### Navigate to Project Directory :

   Change to the project directory using the following command:

   ```bash
   cd DailyNotes
   ```
3. ### Backend Setup
    Navigate to the server directory:
    ```bash
    cd server
    ```
    Install dependencies:
    ```bash
    npm install
    ```
    Copy the environment file:
    ```bash
    cp .env.example .env
    ```
    Open the newly created .env file and provide values for the following:
   - MONGO_URI=your_mongodb_connection_string
   - JWT_SECRET=your_jwt_secre
  
    Start the backend server:
    ```sh
    $ npm start # or npm run dev
    ```
    -   The backend server will run at: [http://localhost:3000](http://localhost:3000)

4. ### Frontend Setup
    Navigate to the clien directory:
    ```bash
    cd client
    ```
    Install frontend dependencies:
    ```bash
    npm install
    ```
    Start the React development server:
    ```sh
    $ npm run dev
    ```
    - The React app should now be running at: [http://localhost:5173](http://localhost:5173)
