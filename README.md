# happybus

# Deployment Guide

This guide provides step-by-step instructions for running and deploying the `happybus_webapp` application using Docker Compose or via a manual local setup.

---

## Option 1: Docker Compose (Recommended)

Using Docker Compose allows you to spin up both the FastAPI backend and frontend server in isolated containers with a single command.

### Prerequisites
* [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

### Steps

1. **Open a terminal** at the project root directory:
   ```bash
   cd /workspaces/dev_webapp_schedule
   ```

2. Build and start the services in detached mode:
   ```bash
   docker-compose ps
   ```

3. Verify running containers:
   ```bash
   docker-compose ps
   ```

4. Access the application:
    Open the Ports tab in VS Code / GitHub Codespaces to view forwarded ports and access the application URLs.

5. Stop the application
   ```bash
   docker-compose down
   ```
---
## Option 2: Option 2: Manual / Local Setup
Follow these steps if you want to run the backend and frontend separately during local development.

### Step 1: Backend Setup (FastAPI)

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Create and activate a virtual environment:
    
    Linux/macOS:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
    Windows:
    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Start the FastAPI server:
    ```bash
    cd /workspaces/happybus
    uvicorn backend.app.main:app --reload --port 8000
    ```
5. Verify backend:
    
    API Base: http://localhost:8000
    
    Interactive OpenAPI Docs: http://localhost:8000/docs



### Step 2: Frontend Setup
Since the frontend consists of static HTML, CSS, and JavaScript files, you can serve it using one of the following methods:

Method A: VS Code Live Server Extension
1. Open the project in VS Code.

2. Right-click frontend/main.html or frontend/login.html in the file explorer.

3. Select Open with Live Server (or click Go Live in the status bar).



## HTML Color Pallete
```Text
Background: #f8fafc (Slate Off-White/Light Gray)
Header Background: #ffffff (Clean White)
Text / Primary Headings: #0f172a (Deep Slate Charcoal)
Subtext / Secondary Labels: #475569 (Muted Slate)
Primary Accent / Buttons: #1e293b (Dark Slate Blue)
Secondary Accent / Banner: #facc15 (Yellow Bus Accent)
Borders / Separators: #e2e8f0 (Soft Light Gray)
```
