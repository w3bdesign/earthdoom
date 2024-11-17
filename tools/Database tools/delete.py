import os
import psycopg2
import dotenv

from psycopg2 import sql

dotenv.load_dotenv()

# Render PostgreSQL database connection details
DATABASE_URL = os.environ.get("DATABASE_URL")


def connect_to_db():
    """Establish a connection to the database."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except psycopg2.Error as e:
        print(f"Unable to connect to the database: {e}")
        return None


def get_all_tables(cursor):
    """Retrieve all table names in the database."""
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    """)
    return [table[0] for table in cursor.fetchall()]


def delete_all_data(conn):
    """Delete all data from all tables in the database."""
    try:
        with conn.cursor() as cursor:
            tables = get_all_tables(cursor)

            for table in tables:
                print(f"Deleting data from table: {table}")
                cursor.execute(
                    sql.SQL("TRUNCATE TABLE {} CASCADE").format(sql.Identifier(table))
                )

            conn.commit()
            print("All data has been deleted successfully.")
    except psycopg2.Error as e:
        conn.rollback()
        print(f"An error occurred while deleting data: {e}")


def main():
    conn = connect_to_db()
    if conn:
        delete_all_data(conn)
        conn.close()


if __name__ == "__main__":
    main()
