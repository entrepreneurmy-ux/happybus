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

# Mount frontend assets safely
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
