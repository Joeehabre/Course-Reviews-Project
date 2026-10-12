"""Add performance indexes for review lookups and sections joins.

Revision ID: add_performance_indexes
Revises: fix_violation_status_constraint
Create Date: 2026-04-12
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "add_performance_indexes"
down_revision: Union[str, Sequence[str], None] = "fix_violation_status_constraint"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    reviews_indexes = {idx["name"] for idx in inspector.get_indexes("reviews")}
    if "ix_reviews_section_status" not in reviews_indexes:
        op.create_index(
            "ix_reviews_section_status",
            "reviews",
            ["section_id", "status"],
            unique=False,
        )

    if "ix_reviews_status_created_at" not in reviews_indexes:
        op.create_index(
            "ix_reviews_status_created_at",
            "reviews",
            ["status", "created_at"],
            unique=False,
        )

    sections_indexes = {idx["name"] for idx in inspector.get_indexes("sections")}
    if "ix_sections_course_professor" not in sections_indexes:
        op.create_index(
            "ix_sections_course_professor",
            "sections",
            ["course_id", "professor_id"],
            unique=False,
        )

    interactions_indexes = {
        idx["name"] for idx in inspector.get_indexes("review_interactions")
    }
    if "ix_review_interactions_review_student" not in interactions_indexes:
        op.create_index(
            "ix_review_interactions_review_student",
            "review_interactions",
            ["review_id", "student_id"],
            unique=False,
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    interactions_indexes = {
        idx["name"] for idx in inspector.get_indexes("review_interactions")
    }
    if "ix_review_interactions_review_student" in interactions_indexes:
        op.drop_index("ix_review_interactions_review_student", table_name="review_interactions")

    sections_indexes = {idx["name"] for idx in inspector.get_indexes("sections")}
    if "ix_sections_course_professor" in sections_indexes:
        op.drop_index("ix_sections_course_professor", table_name="sections")

    reviews_indexes = {idx["name"] for idx in inspector.get_indexes("reviews")}
    if "ix_reviews_status_created_at" in reviews_indexes:
        op.drop_index("ix_reviews_status_created_at", table_name="reviews")

    if "ix_reviews_section_status" in reviews_indexes:
        op.drop_index("ix_reviews_section_status", table_name="reviews")
