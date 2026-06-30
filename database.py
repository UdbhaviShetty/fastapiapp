from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
import os

# Read the DB URL from the environment to avoid hardcoding credentials.
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:shetty1211@localhost:5432/student_db"


# Provide an early, friendly validation for common missing-password mistakes.
# from urllib.parse import urlparse
# parsed_db_url = urlparse(SQLALCHEMY_DATABASE_URL)
# if parsed_db_url.scheme.startswith("postgres") and parsed_db_url.username and parsed_db_url.password is None:
#     raise RuntimeError(
#         "DATABASE_URL is missing a password. "
#         "Use postgresql://postgres:shetty1211@localhost:5432/student_db"
#     )

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
