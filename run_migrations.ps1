# Prompts for Postgres password, sets DATABASE_URL, tests connection, runs alembic
param(
    [string]$DbUser = 'postgres',
    [string]$DbHost = 'localhost',
    [int]$DbPort = 5432,
    [string]$DbName = 'student_db'
)

# Prompt for password securely
$secure = Read-Host "Postgres password" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)

try {
    $env:DATABASE_URL = "postgresql://$($DbUser):$($plain)@$($DbHost):$($DbPort)/$($DbName)"
} finally {
    # zero the plain password variable for safety
    if ($plain) { $plain = $null }
}
Write-Host "DATABASE_URL set for this session. Testing connection..."

# Test connection using a small temporary Python script to avoid quoting issues
$tmp = Join-Path $env:TEMP "alembic_test_conn.py"
$py = @'
import os, psycopg2, sys
try:
    psycopg2.connect(os.environ.get("DATABASE_URL",""))
    print("connected")
except Exception as e:
    print("ERROR:" + str(e))
    sys.exit(1)
'@

Set-Content -Path $tmp -Value $py -Encoding UTF8
python $tmp
$exit = $LASTEXITCODE
Remove-Item -Path $tmp -ErrorAction SilentlyContinue
if ($exit -ne 0) {
    Write-Error "DB connection test failed. Check password and Postgres status."
    exit 1
}

Write-Host "Connection OK. Generating and applying migrations..."

alembic revision --autogenerate -m "initial migrations"
if ($LASTEXITCODE -ne 0) {
    Write-Error "alembic revision failed"
    exit 1
}

alembic upgrade head
if ($LASTEXITCODE -ne 0) {
    Write-Error "alembic upgrade failed"
    exit 1
}

Write-Host "Migrations applied successfully."
