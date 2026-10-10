import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status

from app.dependencies import DBDep, AdminUser
from app.models.user import User
from app.schemas import MuteUserRequest, UserStatusOut
from app import crud

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/users/{user_id}/mute", response_model=UserStatusOut)
async def mute_user(
    user_id: uuid.UUID,
    body: MuteUserRequest,
    db: DBDep,
    admin: AdminUser,
):
    """Mute a user for a specified duration in minutes (admin only)."""
    user = await crud.users.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot mute your own account.")

    user.muted_until = datetime.utcnow() + timedelta(minutes=body.minutes)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/users/{user_id}/unmute", response_model=UserStatusOut)
async def unmute_user(
    user_id: uuid.UUID,
    db: DBDep,
    _: AdminUser,
):
    """Remove mute restriction from a user (admin only)."""
    user = await crud.users.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.muted_until = None
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/users/{user_id}/block", response_model=UserStatusOut)
async def block_user(
    user_id: uuid.UUID,
    db: DBDep,
    admin: AdminUser,
):
    """Block a user from posting or editing reviews (admin only)."""
    user = await crud.users.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot block your own account.")

    user.is_blocked = True
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/users/{user_id}/unblock", response_model=UserStatusOut)
async def unblock_user(
    user_id: uuid.UUID,
    db: DBDep,
    _: AdminUser,
):
    """Unblock a user (admin only)."""
    user = await crud.users.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.is_blocked = False
    await db.commit()
    await db.refresh(user)
    return user