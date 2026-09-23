from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.user import User


def get_users(db: Session, page: int, page_size: int, search: str | None = None):
    query = db.query(User)

    if search:
        search = search.strip()

        if search:
            pattern = f"%{search}%"

            query = query.filter(
                or_(
                    User.first_name.ilike(pattern),
                    User.last_name.ilike(pattern),
                    User.email.ilike(pattern),
                    User.username.ilike(pattern),
                )
            )

    total = query.count()

    users = (
        query
        .order_by(User.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    total_pages = (
        (total + page_size - 1) // page_size
        if total
        else 0
    )

    return users, total, total_pages