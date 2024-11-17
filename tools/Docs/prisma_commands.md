# Prisma CLI Cheatsheet

## Database Management

### Initialize Prisma in your project

```
npx prisma init
```

### Generate Prisma Client

```
npx prisma generate
```

### Push schema changes to the database

```
npx prisma db push
```

### Pull the database schema

```
npx prisma db pull
```

### Create and apply migrations

```
npx prisma migrate dev --name migration_name
```

### Apply migrations in production

```
npx prisma migrate deploy
```

## Data Management

### Open Prisma Studio (GUI to view and edit data)

```
npx prisma studio
```

### Seed the database

```
npx prisma db seed
```

## Database Dumps

### Dump the database (MySQL)

```
npx prisma db execute --file ./dump.sql --schema ./schema.prisma
```

### Dump the database (PostgreSQL)

```
pg_dump -O -x -h localhost -U username database_name > dump.sql
```

## Introspection and Visualization

### Introspect the database and update the schema

```
npx prisma db pull
```

### Generate an ERD (Entity Relationship Diagram)

```
npx prisma generate --schema=./prisma/schema.prisma
```

## Troubleshooting

### Reset the database (caution: deletes all data)

```
npx prisma migrate reset
```

### Format the Prisma schema

```
npx prisma format
```

### Validate the Prisma schema

```
npx prisma validate
