def test_create_user(client):
    response = client.post(
        "/auth/",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": "test@example.com",
            "username": "testuser",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 201

    data = response.json()
    assert data["username"] == "testuser"
    assert "user_id" in data


def test_duplicate_username(client):
    user = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test1@example.com",
        "username": "duplicateuser",
        "password": "TestPassword123!",
    }

    first = client.post("/auth/", json=user)
    assert first.status_code == 201

    second = client.post(
        "/auth/",
        json={
            **user,
            "email": "test2@example.com",
        },
    )

    assert second.status_code == 409


def test_duplicate_email(client):
    first = client.post(
        "/auth/",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": "duplicate@example.com",
            "username": "user1",
            "password": "TestPassword123!",
        },
    )
    assert first.status_code == 201

    second = client.post(
        "/auth/",
        json={
            "first_name": "Test",
            "last_name": "User",
            "email": "duplicate@example.com",
            "username": "user2",
            "password": "TestPassword123!",
        },
    )

    assert second.status_code == 409


def test_login(client):
    client.post(
        "/auth/",
        json={
            "first_name": "Login",
            "last_name": "Test",
            "email": "login@example.com",
            "username": "loginuser",
            "password": "TestPassword123!",
        },
    )

    response = client.post(
        "/auth/token",
        data={
            "username": "loginuser",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert data["token_type"] == "bearer"
    assert "access_token" in data


def test_login_wrong_password(client):
    client.post(
        "/auth/",
        json={
            "first_name": "Wrong",
            "last_name": "Password",
            "email": "wrong@example.com",
            "username": "wrongpassword",
            "password": "CorrectPassword123!",
        },
    )

    response = client.post(
        "/auth/token",
        data={
            "username": "wrongpassword",
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401


def test_me_requires_authentication(client):
    response = client.get("/auth/me")

    assert response.status_code == 401