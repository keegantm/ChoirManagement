'''
#!/bin/bash

# Navigate to the directory containing SQL scripts
cd server/database

# Drop, create, and populate the database
echo "Setting up the database..."
mysql --user=root --execute="source createDB.sql"
mysql --user=root --execute="source populateDb.sql"

# Navigate back to the root directory
cd ../../

# Start Flask server by running server.py
echo "Starting Flask server..."
python server/server.py &

# Navigate to React frontend directory
cd client/react-demo

# Start React frontend
echo "Starting React frontend..."
npm run dev
'''
#!/bin/bash

# Step 1: Start the MySQL server via XAMPP (use sudo to have root permissions)
echo "Starting MySQL server via XAMPP..."
sudo /Applications/XAMPP/xamppfiles/xampp startmysql

# Step 2: Wait for the server to start
sleep 5

# Step 3: Navigate to the directory containing SQL scripts
cd server/database || { echo "Directory not found"; exit 1; }

# Step 4: Drop, create, and populate the database
echo "Setting up the database..."
mysql --user=root --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock --execute="source createDB.sql"
mysql --user=root --socket=/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock --execute="source populateDb.sql"

# Step 5: Navigate back to the root directory
cd ../../ || { echo "Directory not found"; exit 1; }

# Step 6: Start Flask server by running server.py
echo "Starting Flask server..."
python server/server.py &

# Step 7: Navigate to React frontend directory
cd client/react-demo || { echo "React frontend directory not found"; exit 1; }

# Step 8: Start React frontend
echo "Starting React frontend..."
npm run dev

