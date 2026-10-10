
import unittest

from optimization import (
    calculate_green_time,
    fixed_signal_time,
    emergency_priority
)


class TestTrafficOptimization(unittest.TestCase):

    def test_low_traffic(self):
        self.assertEqual(calculate_green_time(2), 25)

    def test_medium_traffic(self):
        self.assertEqual(calculate_green_time(5), 35)

    def test_high_traffic(self):
        self.assertEqual(calculate_green_time(10.68), 55)

    def test_maximum_green_time(self):
        self.assertEqual(calculate_green_time(15), 60)

    def test_fixed_signal_time(self):
        self.assertEqual(fixed_signal_time(), 30)

    def test_emergency_priority_active(self):
        result = emergency_priority(True)
        self.assertTrue(result["priority"])
        self.assertEqual(result["green_time"], 60)

    def test_emergency_priority_inactive(self):
        result = emergency_priority(False)
        self.assertFalse(result["priority"])


if __name__ == "__main__":
    unittest.main()
