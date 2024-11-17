from rich.console import Console
from rich.table import Table
from rich.prompt import IntPrompt
from rich.panel import Panel

console = Console()

COMBAT_STATS = {
    'Infantry': {
        'Infantry': 0.025,
        'Shadows': 0.02,
        'Goliaths': 1.6,
        'Hellspawn': 0.8,
        'Ares': 3.00,
    },
    'Shadows': {
        'Infantry': 0.02,
        'Shadows': 0.105,
        'Goliaths': 1.2,
        'Hellspawn': 0.31,
        'Ares': 2.35,
    },
    'Goliaths': {
        'Infantry': 0.015,
        'Shadows': 0.025,
        'Goliaths': 0.05,
        'Hellspawn': 0.3,
        'Ares': 0.125,
    },
    'Hellspawn': {
        'Infantry': 0.0025,
        'Shadows': 0.027,
        'Goliaths': 0.025,
        'Hellspawn': 0.05,
        'Ares': 0.18,
    },
    'Ares': {
        'Infantry': 0.0035,
        'Shadows': 0.025,
        'Goliaths': 0.025,
        'Hellspawn': 0.04,
        'Ares': 0.05,
    }
}

def calculate_damage(attacker_units, defender_units):
    total_damage = {}
    
    # Initialize damage counters for each unit type
    for unit_type in COMBAT_STATS.keys():
        total_damage[unit_type] = 0
    
    # Calculate damage for each attacking unit type against each defending unit type
    for attacker_type, attacker_count in attacker_units.items():
        if attacker_count > 0:
            for defender_type, defender_count in defender_units.items():
                if defender_count > 0 and defender_type in COMBAT_STATS[attacker_type]:
                    damage = attacker_count * COMBAT_STATS[attacker_type][defender_type]
                    total_damage[defender_type] += damage
    
    return total_damage

def get_unit_counts(side):
    units = {}
    console.print(f"\n[bold cyan]Enter {side} unit counts:[/bold cyan]")
    
    for unit_type in COMBAT_STATS.keys():
        count = IntPrompt.ask(f"Number of {unit_type}", default=0)
        units[unit_type] = count
    
    return units

def display_results(attacker_units, defender_units, attacker_damage, defender_damage):
    # Create battle summary table
    table = Table(title="Battle Summary")
    table.add_column("Unit Type", style="cyan")
    table.add_column("Attacker Units", justify="right")
    table.add_column("Defender Units", justify="right")
    table.add_column("Damage to Attackers", justify="right", style="red")
    table.add_column("Damage to Defenders", justify="right", style="red")
    
    for unit_type in COMBAT_STATS.keys():
        table.add_row(
            unit_type,
            str(attacker_units[unit_type]),
            str(defender_units[unit_type]),
            f"{defender_damage[unit_type]:.2f}",
            f"{attacker_damage[unit_type]:.2f}"
        )
    
    console.print(table)
    
    # Calculate and display total damage
    total_to_attackers = sum(defender_damage.values())
    total_to_defenders = sum(attacker_damage.values())
    
    summary = Table.grid()
    summary.add_row("[bold cyan]Total Damage Summary[/bold cyan]")
    summary.add_row(f"Total damage to attackers: [red]{total_to_attackers:.2f}[/red]")
    summary.add_row(f"Total damage to defenders: [red]{total_to_defenders:.2f}[/red]")
    
    console.print(Panel(summary))

def main():
    console.print("[bold green]EarthDoom Battle Calculator[/bold green]")
    
    # Get unit counts
    attacker_units = get_unit_counts("attacker")
    defender_units = get_unit_counts("defender")
    
    # Calculate damage for both sides
    damage_to_defenders = calculate_damage(attacker_units, defender_units)
    damage_to_attackers = calculate_damage(defender_units, attacker_units)
    
    # Display results
    display_results(attacker_units, defender_units, damage_to_defenders, damage_to_attackers)

if __name__ == "__main__":
    main()
