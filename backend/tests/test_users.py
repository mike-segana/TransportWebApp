def test_list_users_requires_auth(client):
    response = client.get("/users/")

    assert response.status_code == 401


def test_list_users_requires_admin(client, user_token):
    response = client.get(
        "/users/",
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access only"


def test_admin_can_list_users(client, admin_token):
    response = client.get(
        "/users/",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200

    data = response.json()

    assert "items" in data
    assert "page" in data
    assert "page_size" in data
    assert "total" in data
    assert "total_pages" in data

    for user in data["items"]:
        assert "id" in user
        assert "first_name" in user
        assert "last_name" in user
        assert "email" in user
        assert "username" in user
        assert "role" in user

        assert "hashed_password" not in user
        assert "password" not in user


def test_admin_user_pagination(client, admin_token):
    response = client.get(
        "/users/?page=1&page_size=1",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["page"] == 1
    assert data["page_size"] == 1
    assert len(data["items"]) <= 1


def test_admin_user_search(client, admin_token):
    response = client.get(
        "/users/?search=test",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200

    data = response.json()

    assert "items" in data
    assert data["page"] == 1