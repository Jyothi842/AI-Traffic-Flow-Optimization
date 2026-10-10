from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from traffic_detection import detect_vehicles


app = FastAPI(
    title="AI Traffic Flow Optimization System"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI Traffic Flow Optimization Backend Running"
    }


@app.get("/traffic-analysis")
def traffic_analysis():
    video_path = "../../data/sample_videos/traffic.mp4"

    result = detect_vehicles(video_path)

    return result