#!/bin/bash

# Check if SQLite database exists, if not, initialize it
if [ ! -f ./db.sqlite ]; then
  echo "SQLite database does not exist. Creating the database..."
  npx prisma migrate deploy   # Apply migrations if needed
fi

# Start the application
npm start