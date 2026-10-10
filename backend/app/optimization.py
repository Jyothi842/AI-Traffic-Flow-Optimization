def calculate_green_time(average_vehicles_per_frame):
    """
    Calculate dynamic green-light duration based on traffic demand.

    The timing increases gradually as the average number of
    detected vehicles per frame increases.

    Minimum green time: 20 seconds
    Maximum green time: 60 seconds
    """

    minimum_green_time = 20
    maximum_green_time = 60
    demand_limit = 12

    # Convert traffic demand into a 0-1 range
    demand_ratio = (
        average_vehicles_per_frame / demand_limit
    )

    # Keep the ratio within the allowed range
    demand_ratio = max(
        0,
        min(demand_ratio, 1)
    )

    # Calculate dynamic green time
    green_time = (
        minimum_green_time
        + demand_ratio
        * (maximum_green_time - minimum_green_time)
    )

    # Round to nearest 5 seconds
    green_time = round(green_time / 5) * 5

    return int(green_time)


def emergency_priority(emergency_detected):
    """
    Handle emergency vehicle priority.
    """

    if emergency_detected:
        return {
            "priority": True,
            "message": "Emergency vehicle detected - priority signal activated",
            "green_time": 60
        }

    return {
        "priority": False,
        "message": "Normal traffic signal operation",
        "green_time": None
    }


def fixed_signal_time():
    """
    Fixed-time traffic signal baseline.
    """

    return 30


if __name__ == "__main__":

    # Test dynamic green-light calculation
    print("Traffic demand 2:", calculate_green_time(2), "seconds")
    print("Traffic demand 5:", calculate_green_time(5), "seconds")
    print("Traffic demand 8:", calculate_green_time(8), "seconds")
    print("Traffic demand 10:", calculate_green_time(10), "seconds")
    print("Traffic demand 15:", calculate_green_time(15), "seconds")

    # Test fixed-time signal
    print("Fixed signal:", fixed_signal_time(), "seconds")

    # Test emergency priority
    print(emergency_priority(False))
    print(emergency_priority(True))