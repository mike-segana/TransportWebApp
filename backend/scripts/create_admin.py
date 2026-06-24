from app.core.database import SessionLocal
from app.models.user import User, Role
from app.dependencies.db import bcrypt_context

def create_admin(username: str, password: str):
    db = SessionLocal()
    existing = db.query(User).filter(User.username == username).first()
    if existing:
        print("User already exists")
        return
    admin = User(
        username=username,
        hashed_password=bcrypt_context.hash(password),
        role=Role.ADMIN
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print("Admin created successfully")
    db.close()

if __name__ == "__main__":
    username = input("Username: ")
    password = input("Password: ")
    create_admin(username, password)