"""
User Interface Module

Handles all user input and output for the battle calculator.
"""

from typing import Dict
from rich.console import Console
from rich.table import Table
from rich.prompt import IntPrompt

from models import BattleResult, SideResult, LandCapture
from game_config import UNIT_ORDER, UNIT_SCORES


class BattleUI:
    """Handles all user input and output for the battle calculator."""
    
    def __init__(self):
        """Initialize the UI handler."""
        self.console = Console()
    
    def display_title(self) -> None:
        """Display the application title."""
        self.console.print("[bold green]EarthDoom Battle Calculator[/bold green]")
    
    def get_unit_counts(self, side: str) -> Dict[str, int]:
        """
        Prompt user for unit counts for a side.
        
        Args:
            side: Name of the side (e.g., "attacker" or "defender")
        
        Returns:
            Dictionary of unit types and counts
        """
        units = {}
        self.console.print(f"\n[bold cyan]Enter {side} unit counts:[/bold cyan]")
        
        for unit_type in UNIT_ORDER:
            count = IntPrompt.ask(f"Number of {unit_type}", default=0)
            units[unit_type] = count
        
        return units
    
    def get_defender_land(self) -> int:
        """
        Prompt user for defender's total land.
        
        Returns:
            Total land amount
        """
        return IntPrompt.ask("\nDefender's total land", default=0)
    
    def display_battle_log(self, log_lines: list[str]) -> None:
        """
        Display the battle log.
        
        Args:
            log_lines: List of log message strings
        """
        self.console.print("\n[bold cyan]Battle Log:[/bold cyan]")
        for line in log_lines:
            self.console.print(line)
    
    def display_force_summary(
        self,
        side_name: str,
        original_units: Dict[str, int],
        side_result: SideResult
    ) -> None:
        """
        Display force summary table for a side.
        
        Args:
            side_name: Name of the side (e.g., "Attacker")
            original_units: Original unit counts
            side_result: Battle results for this side
        """
        self.console.print(f"\n[bold cyan]{side_name} Force Summary:[/bold cyan]")
        
        table = Table()
        table.add_column("Unit Type", style="cyan")
        table.add_column("Initial", justify="right")
        table.add_column("Lost", justify="right", style="red")
        table.add_column("Survivors", justify="right", style="green")
        table.add_column("Unit Score", justify="right", style="yellow")
        table.add_column("Score Lost", justify="right", style="red")
        
        total_initial_score = 0
        total_lost_score = 0
        
        for unit_type in UNIT_ORDER:
            if original_units.get(unit_type, 0) <= 0:
                continue
            
            initial = original_units[unit_type]
            lost = side_result.units_killed.get(unit_type, 0)
            survivors = side_result.survivors.get(unit_type, 0)
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
        
        self.console.print(table)
    
    def display_land_capture(
        self,
        land_capture: LandCapture,
        defender_land: int
    ) -> None:
        """
        Display land capture results.
        
        Args:
            land_capture: LandCapture object with capture data
            defender_land: Total defender land
        """
        table = Table(title="Land Capture Results")
        table.add_column("Category", style="cyan")
        table.add_column("Amount", justify="right")
        
        table.add_row("Defender's Total Land", str(defender_land))
        table.add_row("Metal Land Captured", f"[green]{land_capture.metal}[/green]")
        table.add_row("Crystal Land Captured", f"[blue]{land_capture.crystal}[/blue]")
        table.add_row("Undeveloped Land Captured", f"[yellow]{land_capture.undeveloped}[/yellow]")
        table.add_row("Total Land Captured", f"[bold green]{land_capture.total}[/bold green]")
        
        self.console.print("\n")
        self.console.print(table)
    
    def display_results(
        self,
        attacker_units: Dict[str, int],
        defender_units: Dict[str, int],
        battle_result: BattleResult,
        land_capture: LandCapture,
        defender_land: int
    ) -> None:
        """
        Display complete battle results.
        
        Args:
            attacker_units: Original attacker unit counts
            defender_units: Original defender unit counts
            battle_result: Complete battle simulation results
            land_capture: Land capture calculations
            defender_land: Total defender land
        """
        self.display_battle_log(battle_result.battle_log)
        self.display_force_summary("Attacker", attacker_units, battle_result.attackers)
        self.display_force_summary("Defender", defender_units, battle_result.defenders)
        self.display_land_capture(land_capture, defender_land)
