def test_admin_can_create_driver(client, admin_token):
    response = client.post(
        "/drivers/",
        json={
            "first_name": "Test",
            "last_name": "Driver",
            "email": "driver@test.com",
            "username": "testdriver",
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 201
    assert response.json()["availability"] == "available"


def test_non_admin_cannot_create_driver(client, user_token):
    response = client.post(
        "/drivers/",
        json={
            "first_name": "Test",
            "last_name": "Driver",
            "email": "driver@test.com",
            "username": "testdriver",
        },
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 403


def test_admin_can_view_drivers(client, admin_token):
    response = client.get(
        "/drivers/",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_admin_can_change_driver_availability(client, admin_token):
    create = client.post(
        "/drivers/",
        json={
            "first_name": "Test",
            "last_name": "Driver",
            "email": "driver@test.com",
            "username": "testdriver",
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert create.status_code == 201

    driver_id = create.json()["id"]

    response = client.patch(
        f"/drivers/{driver_id}",
        json={"new_status": "offline"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200
    assert response.json()["availability"] == "offline"


def test_cannot_update_nonexistent_driver(client, admin_token):
    response = client.patch(
        "/drivers/999999",
        json={"new_status": "offline"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 404