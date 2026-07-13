# Hospital Management System (No Docker, No Vite)

Plain **HTML + CSS + JS + React (via CDN)** frontend, and **Spring Boot + MySQL** backend. No npm install, no build step, no Docker required.

## Project Structure

```
hms-simple/
├── backend/
│   ├── database/
│   │   └── schema.sql        # optional manual DB schema (see note below)
│   ├── run.sh                 # quick-start script (Mac/Linux/Git Bash)
│   ├── run.bat                # quick-start script (Windows)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/hms/...
│       └── resources/
│           └── application.properties
└── frontend/
    └── index.html              # entire frontend: HTML + CSS + React, all in one file
```

## Database Setup

You have two options — pick whichever you're comfortable with.

**Option A (recommended, less to think about):** Do nothing. The app auto-creates the database and all tables on first startup (`spring.jpa.hibernate.ddl-auto=update` in `application.properties`). Just make sure MySQL itself is running.

**Option B (manual, if you want to see/control the schema):** Run `backend/database/schema.sql` yourself in MySQL Workbench or the CLI before starting the app:
```bash
mysql -u root -p < backend/database/schema.sql
```
This creates the `hms_db` database and all 9 tables ahead of time. It's safe to do this even with `ddl-auto=update` still on — Hibernate will just see the tables already match and leave them alone.

> The default admin login (`admin` / `Admin@123`) is always seeded by the app itself on first startup, not by the SQL file, because its password needs to be encrypted the same way the app encrypts all passwords.

## How to Run

### Fast way — use the run script
```bash
cd backend
./run.sh        # Mac/Linux/Git Bash
# or
run.bat         # Windows
```
Open the script first and edit `DB_PASSWORD` (and `SERVER_PORT` if 8080 is taken) to match your setup — then every future run is just one command.

### Manual way
```bash
cd backend
export DB_HOST=localhost DB_PORT=3306 DB_NAME=hms_db DB_USER=root DB_PASSWORD=yourpassword SERVER_PORT=8080
mvn clean package -DskipTests
java -jar target/hms-backend.jar
```
(On Windows PowerShell, use `$env:DB_PASSWORD="yourpassword"` etc. instead of `export`.)

Backend runs on `http://localhost:8080` (or whatever `SERVER_PORT` you set).
Swagger docs: `http://localhost:8080/swagger-ui.html`.

### Open the frontend
- **VS Code:** install the **Live Server** extension → right-click `frontend/index.html` → "Open with Live Server"
- **Or:** `cd frontend && python3 -m http.server 5500` → open `http://localhost:5500`
- **Or:** just double-click `index.html`

Login with `admin` / `Admin@123`, or click **"Create one"** on the login page to register your own account.

## If your backend runs on a different port
Edit `frontend/index.html`, find near the top of the `<script type="text/babel">` block:
```js
const API_BASE_URL = "http://localhost:8080/api";
```
and change `8080` to match your `SERVER_PORT`.

## Port 8080 already in use?
Set a different port before running:
```bash
export SERVER_PORT=8081     # Mac/Linux
$env:SERVER_PORT="8081"     # Windows PowerShell
```
(or edit it directly in `run.sh` / `run.bat`), then update `API_BASE_URL` in `index.html` to match.
