Alembic migrations — how to run

This project reads the DB URL from the `DATABASE_URL` environment variable.
Do not store plaintext passwords in source files.

1) If you want a local file, copy `.env.example` to `.env` and update the password.

2) Set `DATABASE_URL` in PowerShell (temporary for current session):

```powershell
$env:DATABASE_URL = 'postgresql://postgres:YOUR_PASSWORD@localhost:5432/student_db'
```

3) Quick connection test:

```powershell
python -c "import os, psycopg2; psycopg2.connect(os.environ['DATABASE_URL']); print('connected')"
```

3) Generate migrations (autogenerate):

```powershell
alembic revision --autogenerate -m "initial migrations"
```

4) Apply migrations to Postgres:

```powershell
alembic upgrade head
```

If you do not know the Postgres `postgres` user's password:

- Preferred: use your database admin tool (pgAdmin) to reset the password for user `postgres`.

- Alternative (requires access to Postgres data dir and service control):
  1. Stop the Postgres service.
  2. Edit `pg_hba.conf`, change local/host lines for `127.0.0.1/::1` and `local` to `trust`.
  3. Start Postgres and run: `psql -U postgres -h localhost -c "ALTER USER postgres WITH PASSWORD 'NEW_PASS';"`
  4. Revert `pg_hba.conf` to previous auth (e.g. `md5`), restart Postgres.

Security note: Do not commit real credentials into the repository. Use environment variables or a secrets manager.
