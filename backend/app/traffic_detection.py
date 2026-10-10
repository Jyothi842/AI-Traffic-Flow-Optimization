from ultralytics import YOLO
import cv2

from optimization import (
    calculate_green_time,
    emergency_priority,
    fixed_signal_time
)


# Load YOLO model
model = YOLO("yolo11n.pt")


# COCO vehicle class IDs
VEHICLE_CLASSES = {
    2: "car",
    3: "motorcycle",
    5: "bus",
    7: "truck"
}


def calculate_traffic_level(average_vehicles_per_frame):
    """
    Determine traffic level from average vehicle detections per frame.
    """

    if average_vehicles_per_frame < 5:
        return "LOW"

    elif average_vehicles_per_frame < 10:
        return "MEDIUM"

    else:
        return "HIGH"


def detect_vehicles(video_path):
    """
    Process a traffic video using YOLO and calculate
    traffic level and signal timing.
    """

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        return {
            "error": "Unable to open video"
        }

    frame_count = 0
    total_vehicles = 0

    vehicle_totals = {
        "car": 0,
        "motorcycle": 0,
        "bus": 0,
        "truck": 0
    }

    # Process video frame by frame
    while True:

        ret, frame = cap.read()

        if not ret:
            break

        frame_count += 1

        # Run YOLO detection
        results = model(
            frame,
            verbose=False
        )

        # Count detected vehicles
        for result in results:

            if result.boxes is None:
                continue

            for cls in result.boxes.cls:

                class_id = int(cls)

                if class_id in VEHICLE_CLASSES:

                    vehicle_name = VEHICLE_CLASSES[class_id]

                    vehicle_totals[vehicle_name] += 1

                    total_vehicles += 1

    cap.release()

    # Calculate average vehicles detected per frame
    average_vehicles_per_frame = (
        total_vehicles / frame_count
        if frame_count > 0
        else 0
    )

    # Determine traffic level
    traffic_level = calculate_traffic_level(
        average_vehicles_per_frame
    )

    # Calculate dynamic signal time
    green_time = calculate_green_time(
        average_vehicles_per_frame
    )

    # Calculate fixed signal baseline
    fixed_time = fixed_signal_time()

    # Emergency vehicle priority
    # Currently set to False because the YOLO model
    # does not contain an ambulance/emergency class.
    emergency = emergency_priority(False)

    # Return complete analysis result
    return {
        "video": video_path,

        "frames_processed": frame_count,

        "total_vehicle_detections": total_vehicles,

        "vehicle_totals": vehicle_totals,

        "average_vehicles_per_frame": round(
            average_vehicles_per_frame,
            2
        ),

        "traffic_level": traffic_level,

        "green_time": green_time,

        "fixed_signal_time": fixed_time,

        "emergency_priority": emergency
    }


# Run directly from terminal
if __name__ == "__main__":

    video_path = "../../data/sample_videos/traffic.mp4"

    result = detect_vehicles(video_path)

    print("\n===== TRAFFIC DETECTION RESULT =====")

    print(
        "Video:",
        result["video"]
    )

    print(
        "Frames processed:",
        result["frames_processed"]
    )

    print(
        "Total vehicle detections:",
        result["total_vehicle_detections"]
    )

    print("\nVehicle detections:")

    print(
        "Cars:",
        result["vehicle_totals"]["car"]
    )

    print(
        "Motorcycles:",
        result["vehicle_totals"]["motorcycle"]
    )

    print(
        "Buses:",
        result["vehicle_totals"]["bus"]
    )

    print(
        "Trucks:",
        result["vehicle_totals"]["truck"]
    )

    print(
        "\nAverage vehicles per frame:",
        result["average_vehicles_per_frame"]
    )

    print(
        "Traffic level:",
        result["traffic_level"]
    )

    print(
        "Dynamic green time:",
        result["green_time"],
        "seconds"
    )

    print(
        "Fixed signal time:",
        result["fixed_signal_time"],
        "seconds"
    )

    print(
        "Emergency priority:",
        result["emergency_priority"]
    )