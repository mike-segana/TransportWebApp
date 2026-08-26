def test_unauthenticated_user_cannot_view_shipments(client):
    response = client.get("/shipments/my")

    assert response.status_code == 401


def test_user_can_view_own_shipments(client, user_token):
    response = client.get(
        "/shipments/my",
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_admin_can_view_all_shipments(client, admin_token):
    response = client.get(
        "/shipments/",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_non_admin_cannot_view_all_shipments(client, user_token):
    response = client.get(
        "/shipments/",
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 403


def test_start_unassigned_shipment_rejected(client, admin_token):
    response = client.patch(
        "/shipments/999999/start-trip",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 404


def test_end_nonexistent_shipment_rejected(client, admin_token):
    response = client.patch(
        "/shipments/999999/end-trip",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 404