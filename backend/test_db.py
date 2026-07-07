import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine

def test_connection():
    try:
        connection = engine.connect()
        print("Successfully connected to the database!")
        connection.close()
    except Exception as e:
        print("Failed to connect to the database:")
        print(e)

if __name__ == "__main__":
    test_connection()
