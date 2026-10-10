# AI-Powered Traffic Flow Optimization System

A student project prototype that analyses a traffic video with YOLO, counts detected vehicles by class, estimates traffic demand, recommends a green-signal duration, and displays the results in a React dashboard.

## Features

- Vehicle detection for cars, motorcycles, buses, and trucks using YOLO (COCO classes).
- Per-class detection totals and average vehicle detections per processed frame.
- LOW / MEDIUM / HIGH traffic categorisation.
- Demand-based green-time recommendation bounded between 20 and 60 seconds.
- Fixed-time baseline of 30 seconds for comparison.
- FastAPI backend and React/Vite dashboard.
- Vehicle distribution chart, analysis history, traffic trend chart, signal recommendation, and AI-decision explanation.
- Export of the latest analysis to CSV.
- Seven automated unit tests for the signal-timing and emergency-priority helper functions.

## Project structure

```text
Traffic-Optimization/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── traffic_detection.py
│   │   ├── optimization.py
│   │   └── test_optimization.py
│   └── venv/                 # Local virtual environment; do not commit
├── data/
│   └── sample_videos/
│       └── traffic.mp4
├── Frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── models/                   # Project model assets, if used
└── yolo11n.pt                # YOLO model weights
```

## Requirements

- Python 3
- Node.js and npm
- YOLO weights (`yolo11n.pt`)
- A sample traffic video at `data/sample_videos/traffic.mp4`

The Python environment needs the dependencies used by the backend, including FastAPI, Uvicorn, Ultralytics, and OpenCV. The frontend uses React, Vite, and Recharts.

## Run the backend

Open Command Prompt in the project directory and run:

```bat
cd backend
venv\Scripts\activate
cd app
python -m uvicorn main:app --reload
```

Backend URLs:

- `http://127.0.0.1:8000/` — health message
- `http://127.0.0.1:8000/traffic-analysis` — run and return video analysis
- `http://127.0.0.1:8000/docs` — interactive API documentation

Keep this terminal open while using the dashboard. The current video path in the backend is relative to the `backend/app` working directory, so launch Uvicorn from that directory as shown above.

## Run the frontend

Open a second Command Prompt:

```bat
cd C:\Users\Jyoth\OneDrive\Desktop\Traffic-Optimization\Frontend
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173/`.

## Run backend unit tests

Open another Command Prompt:

```bat
cd C:\Users\Jyoth\OneDrive\Desktop\Traffic-Optimization\backend
venv\Scripts\activate
cd app
python test_optimization.py
```

The current test suite contains seven tests and was verified to pass with `Ran 7 tests ... OK`.

## How the prototype works

1. FastAPI receives a request for `/traffic-analysis`.
2. YOLO processes the sample video frame by frame.
3. Detections belonging to the car, motorcycle, bus, and truck classes are counted.
4. The average number of vehicle detections per frame is used as a traffic-demand proxy.
5. The prototype maps that value to a traffic category and recommends a green-light duration.
6. The API returns the results for the dashboard and CSV export.

## Current algorithm

The current dynamic timing helper scales the average detections per frame against a demand limit of 12, maps the result to a 20–60 second range, and rounds the recommendation to the nearest 5 seconds. A fixed 30-second duration is used as the baseline.

For the current sample video, the verified output was:

- Frames processed: 1,170
- Total vehicle detections across frames: 12,494
- Cars: 6,445 detections
- Motorcycles: 3,765 detections
- Buses: 745 detections
- Trucks: 1,539 detections
- Average vehicle detections per frame: 10.68
- Traffic category: HIGH
- Dynamic green-time recommendation: 55 seconds
- Fixed baseline: 30 seconds

These are results from the sample video and current model/configuration, not general performance claims.

## Important limitations

- The reported total is a count of detections across frames, **not a count of unique vehicles**. A vehicle visible in multiple frames can be counted many times.
- “Average vehicles per frame” is a simple demand proxy; it is not a calibrated physical road-density measurement.
- The current green-time calculation is a simple demand-based rule, not a validated traffic-engineering optimiser.
- The fixed-versus-dynamic time difference is a recommendation comparison. The project has not yet measured actual average waiting-time reduction, throughput improvement, or travel-time improvement.
- Emergency priority is currently helper logic only. The standard YOLO model used here does not detect ambulances as a supported class, so real emergency-vehicle detection and automatic priority control are not implemented.
- The signal on the dashboard is a visualised recommendation; this prototype does not control a real traffic signal.

## Suggested final checks before submission

1. Start the backend and confirm `/traffic-analysis` returns JSON.
2. Start the frontend and run an analysis from the dashboard.
3. Confirm the fixed/dynamic comparison, charts, and CSV download work.
4. Run `python test_optimization.py` and keep the successful test output for evidence.
5. Run `npm run build` inside `Frontend` to check the production frontend build.
6. Do not commit `venv/`, `node_modules/`, large unrelated files, or private information to GitHub.

## Academic integrity note

Describe this as a working prototype and report only measurements actually obtained. Do not claim reduced waiting time or working emergency-vehicle detection unless those functions are implemented and tested.
