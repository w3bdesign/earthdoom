from rich.console import Console
from rich.table import Table
from rich.prompt import IntPrompt

console = Console()

# Units in attack order (weakest to strongest)
UNIT_ORDER = [
    'Infantry',    # 250
    'Reaper',      # 800
    'Shadows',     # 1000
    'Avenger',     # 1400
    'Grabber',    # 1600
    'Cobra',       # 3000
    'Goliaths',    # 5000
    'Hellspawn',   # 5000
    'LuciusStalker', # 6000
    'Ares',        # 7000
]

UNIT_SCORES = {
    'Infantry': 250,
    'Reaper': 800,
    'Shadows': 1000,
    'Avenger': 1400,
    'Grabber': 1600,
    'Cobra': 3000,
    'Goliaths': 5000,
    'Hellspawn': 5000,
    'LuciusStalker': 6000,
    'Ares': 7000,
}

COMBAT_STATS = {
    'Infantry': {
        'Infantry': 0.025,
        'Shadows': 0.02,
        'Goliaths': 1.6,
        'Hellspawn': 0.8,
        'Ares': 3.00,
        'Cobra': 0.02,
        'Grabber': 0.015,
        'Reaper': 0.005,
    },
    'Shadows': {
        'Infantry': 0.02,
        'Shadows': 0.105,
        'Goliaths': 1.2,
        'Hellspawn': 0.31,
        'Ares': 2.35,
        'Cobra': 0.005,
        'Grabber': 0.015,
        'Reaper': 0.04,
    },
    'Goliaths': {
        'Infantry': 0.015,
        'Shadows': 0.025,
        'Goliaths': 0.05,
        'Hellspawn': 0.3,
        'Ares': 0.125,
        'Cobra': 0.015,
        'Grabber': 0.055,
        'Reaper': 0.1,
    },
    'Grabber': {
        'Infantry': 0.015,
        'Shadows': 0.015,
        'Goliaths': 0.055,
        'Hellspawn': 0.11,
        'Ares': 0.135,
        'Cobra': 0.0,
        'Grabber': 0.0,
        'Reaper': 0.1,
    },
    'Cobra': {
        'Infantry': 0.02,
        'Shadows': 0.005,
        'Goliaths': 0.015,
        'Hellspawn': 0.25,
        'Ares': 1.00,
        'Cobra': 0.0,
        'Grabber': 0.0,
        'Reaper': 0.09,
    },
    'Hellspawn': {
        'Infantry': 0.0025,
        'Shadows': 0.027,
        'Goliaths': 0.025,
        'Hellspawn': 0.05,
        'Ares': 0.18,
        'Cobra': 0.25,
        'Grabber': 0.11,
        'Reaper': 0.15,
    },
    'Ares': {
        'Infantry': 0.0035,
        'Shadows': 0.025,
        'Goliaths': 0.025,
        'Hellspawn': 0.04,
        'Ares': 0.05,
        'Cobra': 1.00,
        'Grabber': 0.135,
        'Reaper': 0.25,
    },
    'Reaper': {
        'Infantry': 0.005,
        'Shadows': 0.04,
        'Goliaths': 0.1,
        'Hellspawn': 0.15,
        'Ares': 0.25,
        'Cobra': 0.0,
        'Grabber': 0.0,
        'Reaper': 0.0,
    },
    'Avenger': {
        'Infantry': 0.0,
        'Shadows': 0.1,
        'Goliaths': 0.07,
        'Hellspawn': 0.0,
        'Ares': 0.0,
        'Cobra': 0.0,
        'Grabber': 0.0,
        'Reaper': 0.2,
    },
    'LuciusStalker': {
        'Infantry': 0.0,
        'Shadows': 0.07,
        'Goliaths': 0.0,
        'Hellspawn': 0.08,
        'Ares': 0.1,
        'Cobra': 0.0,
        'Grabber': 0.0,
        'Reaper': 0.0,
    }
}

LAND_CAPTURE_RATE = 0.1  # 10% capture rate per Grabber

def get_unit_counts(side):
    units = {}
    console.print(f"\n[bold cyan]Enter {side} unit counts:[/bold cyan]")
    
    for unit_type in UNIT_ORDER:  # Use ordered list for input
        count = IntPrompt.ask(f"Number of {unit_type}", default=0)
        units[unit_type] = count
    
    return units

def calculate_damage_step(attacker_type, attacker_count, defender_type, defender_count):
    if attacker_count > 0 and defender_count > 0:
        effectiveness = COMBAT_STATS[attacker_type].get(defender_type, 0)
        if effectiveness > 0:
            damage = attacker_count * effectiveness
            killed = min(defender_count, int(damage))
            return {
                'attacker': attacker_type,
                'attacker_count': attacker_count,
                'defender': defender_type,
                'defender_count': defender_count,
                'effectiveness': effectiveness,
                'damage': damage,
                'killed': killed
            }
    return None

def simulate_battle(attacker_units, defender_units):
    battle_log = []
    current_units = {
        'attackers': attacker_units.copy(),
        'defenders': defender_units.copy()
    }
    
    total_results = {
        'attackers': {'units_killed': {}, 'survivors': {}, 'score_lost': 0},
        'defenders': {'units_killed': {}, 'survivors': {}, 'score_lost': 0}
    }

    # Display attack order
    battle_log.append("[bold cyan]Unit Attack Order (weakest to strongest):[/bold cyan]")
    for i, unit in enumerate(UNIT_ORDER, 1):
        battle_log.append(f"{i}. {unit} (Score: {UNIT_SCORES[unit]:,})")
    battle_log.append("")

    # Process each attacking unit's actions in order
    battle_log.append("[bold cyan]Attacker Phase:[/bold cyan]")
    for att_type in UNIT_ORDER:  # Use ordered list for attacks
        if att_type in attacker_units and attacker_units[att_type] > 0:
            battle_log.append(f"\n[yellow]{att_type} actions (Score: {UNIT_SCORES[att_type]:,}):[/yellow]")
            for def_type in UNIT_ORDER:  # Use ordered list for targets
                if def_type in defender_units and defender_units[def_type] > 0:
                    step = calculate_damage_step(
                        att_type, 
                        current_units['attackers'][att_type],
                        def_type,
                        current_units['defenders'][def_type]
                    )
                    if step:
                        battle_log.append(
                            f"{step['attacker_count']} {step['attacker']} "
                            f"attack {step['defender_count']} {step['defender']} "
                            f"(effectiveness: {step['effectiveness']:.3f}) "
                            f"dealing {step['damage']:.1f} damage, "
                            f"killing {step['killed']} units"
                        )
                        current_units['defenders'][def_type] -= step['killed']
                        total_results['defenders']['units_killed'][def_type] = \
                            total_results['defenders']['units_killed'].get(def_type, 0) + step['killed']

    # Process each defending unit's actions in order
    battle_log.append("\n[bold cyan]Defender Phase:[/bold cyan]")
    for def_type in UNIT_ORDER:  # Use ordered list for attacks
        if def_type in defender_units and defender_units[def_type] > 0:
            battle_log.append(f"\n[yellow]{def_type} actions (Score: {UNIT_SCORES[def_type]:,}):[/yellow]")
            for att_type in UNIT_ORDER:  # Use ordered list for targets
                if att_type in attacker_units and attacker_units[att_type] > 0:
                    step = calculate_damage_step(
                        def_type,
                        current_units['defenders'][def_type],
                        att_type,
                        current_units['attackers'][att_type]
                    )
                    if step:
                        battle_log.append(
                            f"{step['attacker_count']} {step['attacker']} "
                            f"attack {step['defender_count']} {step['defender']} "
                            f"(effectiveness: {step['effectiveness']:.3f}) "
                            f"dealing {step['damage']:.1f} damage, "
                            f"killing {step['killed']} units"
                        )
                        current_units['attackers'][att_type] -= step['killed']
                        total_results['attackers']['units_killed'][att_type] = \
                            total_results['attackers']['units_killed'].get(att_type, 0) + step['killed']

    # Calculate survivors and score losses
    for side in ['attackers', 'defenders']:
        units = attacker_units if side == 'attackers' else defender_units
        for unit_type in UNIT_ORDER:  # Use ordered list for consistent order
            if unit_type in units:
                killed = total_results[side]['units_killed'].get(unit_type, 0)
                total_results[side]['survivors'][unit_type] = units[unit_type] - killed
                total_results[side]['score_lost'] += killed * UNIT_SCORES.get(unit_type, 0)

    return battle_log, total_results

def calculate_land_capture(attacker_units, defender_land):
    Grabbers = attacker_units.get('Grabber', 0)
    if Grabbers > 0:
        max_capture = min(Grabbers * LAND_CAPTURE_RATE, defender_land)
        return {
            'metal': round(max_capture * 0.4),
            'crystal': round(max_capture * 0.4),
            'undeveloped': round(max_capture * 0.2)
        }
    return {'metal': 0, 'crystal': 0, 'undeveloped': 0}

def display_results(attacker_units, defender_units, battle_log, combat_results, land_capture, defender_land):
    # Display battle log
    console.print("\n[bold cyan]Battle Log:[/bold cyan]")
    for line in battle_log:
        console.print(line)

    # Display force summaries
    for side, units in [("Attacker", attacker_units), ("Defender", defender_units)]:
        console.print(f"\n[bold cyan]{side} Force Summary:[/bold cyan]")
        table = Table()
        table.add_column("Unit Type", style="cyan")
        table.add_column("Initial", justify="right")
        table.add_column("Lost", justify="right", style="red")
        table.add_column("Survivors", justify="right", style="green")
        table.add_column("Unit Score", justify="right", style="yellow")
        table.add_column("Score Lost", justify="right", style="red")
        
        side_key = 'attackers' if side == "Attacker" else 'defenders'
        total_initial_score = 0
        total_lost_score = 0
        
        for unit_type in UNIT_ORDER:  # Use ordered list for consistent display
            if units.get(unit_type, 0) > 0:
                initial = units[unit_type]
                lost = combat_results[side_key]['units_killed'].get(unit_type, 0)
                survivors = combat_results[side_key]['survivors'].get(unit_type, 0)
                unit_score = UNIT_SCORES[unit_type]
                score_lost = lost * unit_score
                
                total_initial_score += initial * unit_score
                total_lost_score += score_lost
                
                table.add_row(
                    unit_type,
                    str(initial),
                    str(lost),
                    str(survivors),
                    f"{unit_score:,}",
                    f"{score_lost:,}"
                )
        
        table.add_row(
            "[bold]TOTALS",
            "",
            "",
            "",
            f"[bold yellow]{total_initial_score:,}",
            f"[bold red]{total_lost_score:,}"
        )
        console.print(table)

    # Display land capture results
    land_table = Table(title="Land Capture Results")
    land_table.add_column("Category", style="cyan")
    land_table.add_column("Amount", justify="right")
    
    land_table.add_row("Defender's Total Land", str(defender_land))
    land_table.add_row("Metal Land Captured", f"[green]{land_capture['metal']}[/green]")
    land_table.add_row("Crystal Land Captured", f"[blue]{land_capture['crystal']}[/blue]")
    land_table.add_row("Undeveloped Land Captured", f"[yellow]{land_capture['undeveloped']}[/yellow]")
    land_table.add_row("Total Land Captured", f"[bold green]{sum(land_capture.values())}[/bold green]")
    
    console.print("\n")
    console.print(land_table)

def main():
    console.print("[bold green]EarthDoom Battle Calculator[/bold green]")
    
    # Get unit counts
    attacker_units = get_unit_counts("attacker")
    defender_units = get_unit_counts("defender")
    
    # Get defender's land
    defender_land = IntPrompt.ask("\nDefender's total land", default=0)
    
    # Simulate battle
    battle_log, combat_results = simulate_battle(attacker_units, defender_units)
    
    # Calculate land capture
    land_capture = calculate_land_capture(attacker_units, defender_land)
    
    # Display results
    display_results(attacker_units, defender_units, battle_log, combat_results, land_capture, defender_land)

if __name__ == "__main__":
    main()
