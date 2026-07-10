@echo off
REM Quick-start script for Windows.
REM Edit the values below once, then just double-click run.bat or run it from a terminal.

set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=hms_db
set DB_USER=root
set DB_PASSWORD=root
set SERVER_PORT=8080

echo Building...
call mvn clean package -DskipTests -q

echo Starting Hospital Management System backend on port %SERVER_PORT% ...
java -jar target\hms-backend.jar
