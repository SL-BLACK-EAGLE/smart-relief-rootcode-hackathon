# Local Development Setup Guide

## Running AI Disaster Relief System Locally (Without Docker)

### Prerequisites
- Python 3.11+
- PostgreSQL (or use SQLite for development)

### Step 1: Install PostgreSQL (Optional - can use SQLite)

**Option A: Install PostgreSQL**
- Download from: https://www.postgresql.org/download/windows/
- Install and create a database named `disaster_relief`

**Option B: Use SQLite (Simpler for development)**
- No installation required, will use file-based database

### Step 2: Set up the Application

1. **Navigate to the ai-service directory**
   ```cmd
   cd ai-service
   ```

2. **Create virtual environment**
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```cmd
   pip install -r requirements.txt
   ```

4. **Configure environment for local development**
   ```cmd
   copy .env.example .env
   ```

5. **Edit .env file for local development**
   Open `.env` file and update:
   ```env
   # For SQLite (easier setup)
   DATABASE_URL=sqlite:///./disaster_relief.db
   
   # OR for PostgreSQL (if installed)
   # DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/disaster_relief
   
   # Other settings
   DEBUG=true
   UPLOAD_DIRECTORY=uploads
   OPENWEATHER_API_KEY=your-api-key-here
   CORS_ORIGINS=*
   ```

6. **Run the application**
   ```cmd
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

### Step 3: Test the Application

Open your browser and go to:
- **Application**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs
- **Health Check**: http://127.0.0.1:8000/health

### Step 4: Test API Endpoints

```bash
# Health check
curl http://127.0.0.1:8000/health

# Upload test image (if you have one)
curl -X POST "http://127.0.0.1:8000/api/v1/damage/analyze" ^
  -F "file=@test_image.jpg" ^
  -F "latitude=40.7128" ^
  -F "longitude=-74.0060"
```

This setup will work without Docker and uses either SQLite or local PostgreSQL.
