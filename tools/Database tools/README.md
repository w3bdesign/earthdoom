# Database Tools

Utilities for managing the EarthDoom PostgreSQL database.

## Tools

### delete.py
A utility for safely clearing all tables in the database.

#### Features
- Safe database connection handling
- Cascading deletion support
- Error handling and rollback
- Environment variable configuration

#### Requirements
- Python 3.x
- psycopg2
- python-dotenv

#### Usage
1. Set up your database URL in a `.env` file:
```
DATABASE_URL=postgresql://username:password@host:port/dbname
```

2. Run the utility:
```bash
python delete.py
```

#### How it works
- Connects to the database using environment variables
- Retrieves all table names from the public schema
- Performs cascading truncate on all tables
- Handles errors with automatic rollback
