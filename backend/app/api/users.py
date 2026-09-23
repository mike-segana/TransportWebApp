from typing import Annotated
from fastapi import APIRouter, Query
from app.dependencies.db import db_dependency, admin_dependency
from app.schemas.user import(UserListResponse, UserResponse)
from app.services.user_service import get_users

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/", response_model=UserListResponse)
def list_users(
    db: db_dependency,
    admin: admin_dependency,
    page: Annotated[int, Query(ge = 1)] = 1,
    page_size: Annotated[int, Query(ge = 1, le = 100)] = 50,
    search: Annotated[str | None, Query(min_length = 1, max_length = 100)] = None):

    users, total, total_pages = get_users(db = db, page = page, page_size = page_size, search = search)

    return UserListResponse(
        items=[
            UserResponse(
                id=user.id,
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                username=user.username,
                role=user.role.value,
            )
            for user in users
        ],
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
    )