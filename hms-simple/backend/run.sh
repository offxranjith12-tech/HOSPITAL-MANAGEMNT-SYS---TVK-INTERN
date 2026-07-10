#!/bin/bash
# Quick-start script for Mac/Linux/Git Bash.
# Edit the values below once, then just run: ./run.sh

export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=hms_db
export DB_USER=root
export DB_PASSWORD=root      # <-- change this to your MySQL password
export SERVER_PORT=8080      # <-- change this if 8080 is already in use

echo "Building..."
mvn clean package -DskipTests -q

echo "Starting Hospital Management System backend on port $SERVER_PORT ..."
java -jar target/hms-backend.jar
