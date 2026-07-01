# Fast_apiapp

## creating fastapi application

# CRUD operations
- CREATE
- READ
- UPDATE
- DELETE

# Rest API
- GET
- POST
- PUT
- DELETE

# STATUS CODES
- ERROR 422: UNPROCESSIBLE IDENTITY DATA INVALIDATION ERROR
- ERROR 200:OK
- ERROR 201:CREATED (LOGIN)
- 400: BAD REQUEST
- 401:UNAUTORIZED
- 403:FORBIDDEN
- 404: PAGE NOT FOUND
- 405:METHOD NOT ALLOWED
- 409:CONFLICT
- 500:INTERNAL SERVER ERROR

# ARCHITECTURE OF FASTAPI APPLICATION
- MODEL :FOR CREATING DATABASE TABLES
- ROUTER:ROUTES REQUESTS TO CONTROLLER(endpoints such as company, jobs etc)
- CONTROLLER: CONTROLLER LOGIC(arithmetic,logical)
- SERVICE: SERVICES PROVIDED BY COMPANY(BUSINESS LOGIC)
- REPOSITORY: DATA ACCESS LAYER
- MIDDLEWARE:REQUEST PROCESSING PIPELINE
- SCHEMA: PYDANTIC MODELS FOR VALIDATION.

# DATABASE
## RELATIONAL DATABASE
- mysql
- postgresql
- sqlite
- sql server

## non-relational database
- dynamodb
- mongodb
- cassandra
- redis

## CONSTRAINTS
- NOT NULL:Prevents NULL values.eg:name
- UNIQUE:Prevents duplicate values.eg:email,phonenumber
- PRIMARY KEY:Unique identifier for each row.eg:student_id
- FOREIGN KEY:Maintains relationships between tables.eg:department_id in student table
- CHECK:Restricts values based on a condition.eg:salary>10000
- DEFAULT:Provides a default value.eg:timestamp:func.now

# modules
- sqlalchemy -- orm
- fastapi -- web framework
- uvicorn-- server for running fastapi application -->'uvicorn app.main:app --reload'
- psycopg2 -- postgresql driver
- pydantic -- data validation
- alembic -- database migration
- typing-extensions -- type hints

# Concepts
- ORM: Object Relational Mapping-- to convert python code into sql query.
- Depends: Dependency injection-- to inject dependencies into route handlers
- Sessionmaker -- To create a session with the database
- SessionLocal -- To create a session with the database for a single request.
- declarative_base -- To create a base class for all the models.
- alembic



