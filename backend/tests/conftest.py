import os
from pathlib import Path
import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from alembic import command
from alembic.config import Config

ENV_TEST_PATH = Path(__file__).resolve().parents[1] / ".env.test"
load_dotenv(ENV_TEST_PATH)

TEST_SECRET_KEY = os.getenv("TEST_SECRET_KEY")
TEST_AUTH_ALGORITHM = os.getenv("TEST_AUTH_ALGORITHM")
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")

if not TEST_DATABASE_URL:
    raise RuntimeError("TEST_DATABASE_URL is not set")

if not TEST_SECRET_KEY:
    raise RuntimeError("TEST_SECRET_KEY is not set")

if not TEST_AUTH_ALGORITHM:
    raise RuntimeError("TEST_AUTH_ALGORITHM is not set")

os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ["AUTH_SECRET_KEY"] = TEST_SECRET_KEY
os.environ["AUTH_ALGORITHM"] = TEST_AUTH_ALGORITHM

from app.main import app
from app.dependencies.db import get_db
from app.models.user import User, Role
from app.dependencies.db import bcrypt_context


engine = create_engine(TEST_DATABASE_URL)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def reset_test_database():
    #Completely reset the PostgreSQL test database
    #removes old tables and enum types
    with engine.begin() as connection:
        connection.execute(text("DROP SCHEMA public CASCADE"))
        connection.execute(text("CREATE SCHEMA public"))

    #Rebuild the database using Alembic migrations.
    alembic_cfg = Config(
        str(Path(__file__).resolve().parents[1] / "alembic.ini")
    )

    alembic_cfg.set_main_option(
        "sqlalchemy.url",
        TEST_DATABASE_URL,
    )

    command.upgrade(alembic_cfg, "head")


@pytest.fixture(autouse=True)
def clean_database():
    reset_test_database()


@pytest.fixture
def db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()

@pytest.fixture
def admin_user(db):
    admin = User(
        first_name="Test",
        last_name="Admin",
        email="admin@test.com",
        username="testadmin",
        hashed_password=bcrypt_context.hash("AdminPassword123!"),
        role=Role.ADMIN,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


@pytest.fixture
def admin_token(client, admin_user):
    response = client.post(
        "/auth/token",
        data={
            "username": "testadmin",
            "password": "AdminPassword123!",
        },
    )

    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def user_token(client):
    response = client.post(
        "/auth/",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": "user@test.com",
            "username": "testuser",
            "password": "UserPassword123!",
        },
    )

    assert response.status_code == 201

    response = client.post(
        "/auth/token",
        data={
            "username": "testuser",
            "password": "UserPassword123!",
        },
    )

    assert response.status_code == 200
    return response.json()["access_token"]