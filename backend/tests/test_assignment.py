def test_nonexistent_driver_rejected(client, admin_token):
    response = client.post(
        "/assignment/",
        json={
            "driver_id": 999999,
            "shipment_id": 999999,
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 404


def test_assignment_requires_admin(client, user_token):
    response = client.post(
        "/assignment/",
        json={
            "driver_id": 1,
            "shipment_id": 1,
        },
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 403


def test_unauthenticated_assignment_rejected(client):
    response = client.post(
        "/assignment/",
        json={
            "driver_id": 1,
            "shipment_id": 1,
        },
    )

    assert response.status_code == 401