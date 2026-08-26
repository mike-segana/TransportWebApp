def request_data():
    return {
        "pickup_address": "10 High Street",
        "pickup_postcode": "SW1A 1AA",
        "dropoff_address": "20 Main Street",
        "dropoff_postcode": "SW1A 2AA",
        "pickup_date": "2026-09-01",
        "pickup_time_slot": "10:00-11:00",
        "helpers_needed": 2,
        "pickup_floor": 1,
        "pickup_has_lift": False,
        "dropoff_floor": 2,
        "dropoff_has_lift": False,
        "pickup_loading_minutes": 30,
        "dropoff_loading_minutes": 30,
    }


def test_create_request(client, user_token):
    response = client.post(
        "/requests/",
        json=request_data(),
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 201

    data = response.json()
    assert data["pickup_address"] == "10 High Street"
    assert data["request_status"] == "pending"


def test_create_request_requires_authentication(client):
    response = client.post(
        "/requests/",
        json=request_data(),
    )

    assert response.status_code == 401


def test_user_can_view_own_requests(client, user_token):
    create = client.post(
        "/requests/",
        json=request_data(),
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert create.status_code == 201

    response = client.get(
        "/requests/my",
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_admin_can_view_all_requests(client, user_token, admin_token):
    create = client.post(
        "/requests/",
        json=request_data(),
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert create.status_code == 201

    response = client.get(
        "/requests/",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_normal_user_cannot_view_all_requests(client, user_token):
    response = client.get(
        "/requests/",
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 403


def test_admin_can_deny_request(client, user_token, admin_token):
    create_response = client.post(
        "/requests/",
        json=request_data(),
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert create_response.status_code == 201

    request_id = create_response.json()["id"]

    response = client.patch(
        f"/requests/{request_id}/deny",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200
    assert response.json()["request_status"] == "denied"


def test_cannot_deny_request_twice(client, user_token, admin_token):
    create_response = client.post(
        "/requests/",
        json=request_data(),
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert create_response.status_code == 201

    request_id = create_response.json()["id"]

    first = client.patch(
        f"/requests/{request_id}/deny",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert first.status_code == 200

    second = client.patch(
        f"/requests/{request_id}/deny",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert second.status_code == 409


def test_invalid_request_data_rejected(client, user_token):
    data = request_data()
    data["helpers_needed"] = -1

    response = client.post(
        "/requests/",
        json=data,
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 422


def test_time_slots(client):
    response = client.get("/requests/time-slots")

    assert response.status_code == 200
    assert "10:00-11:00" in response.json()