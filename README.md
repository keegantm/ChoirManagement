# ChoirManagement

## Project Set Up
1. Set up the enviroment.
Either use enviroment.yaml file to create an enviroment, or 
install the following packages:
    - flask
    - flask_cors
    - Flask-SQLAlchemy
    - flask-mysql
    - werkzeug.security
    - PyJWT
    - dotenv
    - Node.js
    - npm

2. Navigate to the /FinalProject folder

3. Set up the backend, navigate to /server
    - In the /database folder, run one of the following files on your MySQL server:
        -```ChoirDatabase.sql``` to build an empty database
        -```Demonstration.sql``` to build a database with dummy data

    - In /server, run the backend server on a terminal via ```python server.py```

4. Set up the frontend
    - Navigate to /client/react-demo
    - If needed, use ```npm install``` to install front-end dependences
    - Run the frontend with the command ```npm run dev```