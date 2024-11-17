# EarthDoom Tools

This directory contains utility tools for the EarthDoom project.

## Tools

### Battle Calculator (battle_calc.py)
A command-line tool for simulating and calculating battle outcomes in EarthDoom. It supports:
- Unit damage calculations between different unit types (Infantry, Shadows, Goliaths, Hellspawn, Ares)
- Interactive input for army compositions
- Detailed battle summaries with damage statistics
- Rich console output for better readability

### Database Utilities (delete.py)
Database management utilities for the EarthDoom PostgreSQL database:
- Clear database tables safely
- Cascading deletion support
- Connection management with environment variables

## Usage

### Battle Calculator
Run the battle calculator to simulate combat outcomes:
```bash
python battle_calc.py
```
Follow the prompts to input attacker and defender unit counts for each unit type.

### Database Cleanup
Execute the database cleanup utility:
```bash
python delete.py
```
Requires proper database credentials in environment variables (DATABASE_URL).

## Additional Resources
For database administration commands using Prisma, see [prisma_commands.md](prisma_commands.md).
