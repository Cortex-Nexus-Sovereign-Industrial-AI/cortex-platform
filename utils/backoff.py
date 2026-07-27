import random
import time

class ExponentialBackoff:
    """
    Exponential Backoff with Decorrelated Jitter (Recommended for production)
    """
    def __init__(self, base_delay=1.0, max_delay=30.0, max_attempts=15):
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.max_attempts = max_attempts
        self.attempt = 0
        self.previous_delay = base_delay

    def get_delay(self):
        """Decorrelated Jitter: High randomness based on previous delay"""
        if self.attempt >= self.max_attempts:
            return None

        # Exponential component
        exponential = min(self.base_delay * (2 ** self.attempt), self.max_delay)

        # Decorrelated Jitter: Random between base and 3x exponential
        delay = random.uniform(self.base_delay, exponential * 3.0)
        
        # Cap and smooth
        delay = min(delay, self.max_delay)
        
        self.previous_delay = delay
        self.attempt += 1
        
        return delay

    def wait(self):
        """Sleep for calculated delay"""
        delay = self.get_delay()
        if delay is None:
            print("Max retry attempts reached.")
            return False
        
        print(f"⏳ Decorrelated Jitter: Waiting {delay:.2f}s (Attempt {self.attempt})")
        time.sleep(delay)
        return True

    def reset(self):
        """Reset after successful connection"""
        self.attempt = 0
        self.previous_delay = self.base_delay


# Quick Test
if __name__ == "__main__":
    backoff = ExponentialBackoff(base_delay=1.0, max_delay=30.0)
    
    for i in range(8):
        if not backoff.wait():
            break
        print(f"Retry {i+1} attempted.\n")
