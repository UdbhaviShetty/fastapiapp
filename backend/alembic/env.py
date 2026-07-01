from logging.config import fileConfig
import sys
import os

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from sqlalchemy import create_engine
import logging
from database import Base
from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Allow overriding the URL via the DATABASE_URL environment variable
# so passwords are not stored in source files. If set, update the alembic
# config value used by engine_from_config below.
db_url = os.getenv("DATABASE_URL")
if db_url:
    # configparser interpolation treats % as special, so escape any
    # percent signs from URL-encoded passwords before writing the option.
    db_url = db_url.replace("%", "%%")
    config.set_main_option("sqlalchemy.url", db_url)

# add your model's MetaData object here
# for 'autogenerate' support
from database import Base
from models.company import Company
from models.job import Job
from models.users import User
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    # Detect whether Alembic was invoked as an autogenerate revision. In
    # that case, allow falling back to an in-memory SQLite engine so users
    # can create revision scripts without a reachable Postgres instance.
    # For all other commands (upgrade, stamp, etc.) we raise the original
    # connection error so the problem is fixed explicitly.
    is_autogenerate_revision = False
    try:
        args = sys.argv
        if "revision" in args and ("--autogenerate" in args or "-m" in args):
            is_autogenerate_revision = True
    except Exception:
        is_autogenerate_revision = False

    try:
        with connectable.connect() as connection:
            context.configure(connection=connection, target_metadata=target_metadata)

            with context.begin_transaction():
                context.run_migrations()
    except Exception as exc:
        allow_fallback = os.getenv("ALEMBIC_AUTOGEN_SQLITE_FALLBACK", "false").lower() in (
            "1",
            "true",
            "yes",
        )
        if is_autogenerate_revision and allow_fallback:
            logging.getLogger().warning(
                "Could not connect to configured database; falling back to in-memory sqlite for autogenerate: %s",
                exc,
            )
            # Use an in-memory SQLite database so autogenerate can compare metadata
            fallback_engine = create_engine("sqlite:///:memory:")
            with fallback_engine.connect() as connection:
                context.configure(connection=connection, target_metadata=target_metadata)

                with context.begin_transaction():
                    context.run_migrations()
            return

        logging.getLogger().error(
            "Alembic could not connect to the configured database. "
            "Ensure DATABASE_URL is set and the Postgres password is correct."
        )
        raise


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
