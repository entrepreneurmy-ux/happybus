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
# Based on your docker-compose volume, /frontend is directly at the container root, 
# or fallback to sibling folder if running local
FRONTEND_DIR = Path("/frontend")
ASSETS_DIR = Path("/frontend/assets")
if not FRONTEND_DIR.exists():
    FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"

# Mount frontend assets safely
app.mount("/css", StaticFiles(directory=str(ASSETS_DIR / "css")), name="css")
app.mount("/js", StaticFiles(directory=str(ASSETS_DIR / "js")), name="js")
app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR / "assets")), name="assets")

# Serve HTML pages safely
@app.get("/", response_class=HTMLResponse)
def read_root():
    file_path = FRONTEND_DIR / "index.html"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"index.html not found at {file_path}")
    return file_path.read_text(encoding="utf-8")

@app.get("/signup.html", response_class=HTMLResponse)
def read_signup():
    file_path = FRONTEND_DIR / "signup.html"
    return file_path.read_text(encoding="utf-8")

@app.get("/login.html", response_class=HTMLResponse)
def read_login():
    file_path = FRONTEND_DIR / "login.html"
    return file_path.read_text(encoding="utf-8")