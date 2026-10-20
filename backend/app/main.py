from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HappyBus API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Look for frontend directory inside the container
FRONTEND_DIR = Path("/frontend")
if not FRONTEND_DIR.exists():
    # Fallback for local development (relative to backend/app/main.py)
    FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"

ASSETS_DIR = FRONTEND_DIR / "assets"

# Mount frontend assets safely
if ASSETS_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")

# Serve HTML pages safely
@app.get("/", response_class=HTMLResponse)
def read_root():
    file_path = FRONTEND_DIR / "index.html"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"index.html not found at {file_path}")
    return file_path.read_text(encoding="utf-8")

@app.get("/index.html", response_class=HTMLResponse)
def read_index():  # Fixed duplicate function name
    file_path = FRONTEND_DIR / "index.html"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"index.html not found at {file_path}")
    return file_path.read_text(encoding="utf-8")

@app.get("/signup.html", response_class=HTMLResponse)
def read_signup():
    file_path = FRONTEND_DIR / "signup.html"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"signup.html not found at {file_path}")
    return file_path.read_text(encoding="utf-8")

@app.get("/login.html", response_class=HTMLResponse)
def read_login():
    file_path = FRONTEND_DIR / "login.html"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"login.html not found at {file_path}")
    return file_path.read_text(encoding="utf-8")