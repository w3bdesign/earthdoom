"""
EarthDoom Battle Calculator

A professional battle simulation tool for calculating combat outcomes,
casualties, and land capture in EarthDoom battles.
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from rich.console import Console
from rich.table import Table
from rich.prompt import IntPrompt


# ============================================================================
# CONSTANTS AND CONFIGURATION
# ============================================================================

UNIT_ORDER = [
    "Infantry",  # 250
    "Reaper",  # 800
    "Shadows",  # 1000
    "Avenger",  # 1400
    "Grabber",  # 1600
    "Cobra",  # 3000
    "Goliaths",  # 5000
    "Hellspawn",  # 5000
    "LuciusStalker",  # 6000
    "Ares",  # 7000
]

UNIT_SCORES = {
    "Infantry": 250,
    "Reaper": 800,
    "Shadows": 1000,
    "Avenger": 1400,
    "Grabber": 1600,
    "Cobra": 3000,
    "Goliaths": 5000,
    "Hellspawn": 5000,
    "LuciusStalker": 6000,
    "Ares": 7000,
}

COMBAT_STATS = {
    "Infantry": {
        "Infantry": 0.025,
        "Shadows": 0.02,
        "Goliaths": 1.6,
        "Hellspawn": 0.8,
        "Ares": 3.00,
        "Cobra": 0.02,
        "Grabber": 0.015,
        "Reaper": 0.005,
    },
    "Shadows": {
        "Infantry": 0.02,
        "Shadows": 0.105,
        "Goliaths": 1.2,
        "Hellspawn": 0.31,
        "Ares": 2.35,
        "Cobra": 0.005,
        "Grabber": 0.015,
        "Reaper": 0.04,
    },
    "Goliaths": {
        "Infantry": 0.015,
        "Shadows": 0.025,
        "Goliaths": 0.05,
        "Hellspawn": 0.3,
        "Ares": 0.125,
        "Cobra": 0.015,
        "Grabber": 0.055,
        "Reaper": 0.1,
    },
    "Grabber": {
        "Infantry": 0.015,
        "Shadows": 0.015,
        "Goliaths": 0.055,
        "Hellspawn": 0.11,
        "Ares": 0.135,
        "Cobra": 0.0,
        "Grabber": 0.0,
        "Reaper": 0.1,
    },
    "Cobra": {
        "Infantry": 0.02,
        "Shadows": 0.005,
        "Goliaths": 0.015,
        "Hellspawn": 0.25,
        "Ares": 1.00,
        "Cobra": 0.0,
        "Grabber": 0.0,
        "Reaper": 0.09,
    },
    "Hellspawn": {
        "Infantry": 0.0025,
        "Shadows": 0.027,
        "Goliaths": 0.025,
        "Hellspawn": 0.05,
        "Ares": 0.18,
        "Cobra": 0.25,
        "Grabber": 0.11,
        "Reaper": 0.15,
    },
    "Ares": {
        "Infantry": 0.0035,
        "Shadows": 0.025,
        "Goliaths": 0.025,
        "Hellspawn": 0.04,
        "Ares": 0.05,
        "Cobra": 1.00,
        "Grabber": 0.135,
        "Reaper": 0.25,
    },
    "Reaper": {
        "Infantry": 0.005,
        "Shadows": 0.04,
        "Goliaths": 0.1,
        "Hellspawn": 0.15,
        "Ares": 0.25,
        "Cobra": 0.0,
        "Grabber": 0.0,
        "Reaper": 0.0,
    },
    "Avenger": {
        "Infantry": 0.0,
        "Shadows": 0.1,
        "Goliaths": 0.07,
        "Hellspawn": 0.0,
        "Ares": 0.0,
        "Cobra": 0.0,
        "Grabber": 0.0,
        "Reaper": 0.2,
    },
    "LuciusStalker": {
        "Infantry": 0.0,
        "Shadows": 0.07,
        "Goliaths": 0.0,
        "Hellspawn": 0.08,
        "Ares": 0.1,
        "Cobra": 0.0,
        "Grabber": 0.0,
        "Reaper": 0.0,
    },
}

LAND_CAPTURE_RATE = 0.1  # 10% capture rate per Grabber


# ============================================================================
# DATA CLASSES
# ============================================================================


@dataclass
class DamageStep:
    """Represents a single damage calculation in battle."""

    attacker_type: str
    attacker_count: int
    defender_type: str
    defender_count: int
    effectiveness: float
    damage: float
    killed: int


@dataclass
class SideResult:
    """Represents battle results for one side (attacker or defender)."""

    units_killed: Dict[str, int] = field(default_factory=dict)
    survivors: Dict[str, int] = field(default_factory=dict)
    score_lost: int = 0


@dataclass
class BattleResult:
    """Encapsulates complete battle results."""

    attackers: SideResult = field(default_factory=SideResult)
    defenders: SideResult = field(default_factory=SideResult)
    battle_log: List[str] = field(default_factory=list)


@dataclass
class LandCapture:
    """Represents captured land distribution."""

    metal: int = 0
    crystal: int = 0
    undeveloped: int = 0

    @property
    def total(self) -> int:
        """Returns total land captured."""
        return self.metal + self.crystal + self.undeveloped


# ============================================================================
# CORE BATTLE SIMULATOR
# ============================================================================


class BattleSimulator:
    """
    Simulates EarthDoom battles between attackers and defenders.

    This class handles all battle logic including damage calculations,
    combat resolution, and land capture mechanics.
    """

    def __init__(self):
        """Initialize the battle simulator."""
        self.console = Console()

    @staticmethod
    def get_combat_effectiveness(attacker: str, defender: str) -> float:
        """
        Get combat effectiveness of an attacker against a defender.

        Args:
            attacker: Attacking unit type
            defender: Defending unit type

        Returns:
            Effectiveness multiplier (0.0 if no effect)
        """
        return COMBAT_STATS.get(attacker, {}).get(defender, 0)

    @staticmethod
    def calculate_damage_step(
        attacker_type: str, attacker_count: int, defender_type: str, defender_count: int
    ) -> Optional[DamageStep]:
        """
        Calculate damage for a single combat step.

        Args:
            attacker_type: Type of attacking unit
            attacker_count: Number of attacking units
            defender_type: Type of defending unit
            defender_count: Number of defending units

        Returns:
            DamageStep object if damage occurs, None otherwise
        """
        if attacker_count <= 0 or defender_count <= 0:
            return None

        effectiveness = BattleSimulator.get_combat_effectiveness(
            attacker_type, defender_type
        )

        if effectiveness <= 0:
            return None

        damage = attacker_count * effectiveness
        killed = min(defender_count, int(damage))

        return DamageStep(
            attacker_type=attacker_type,
            attacker_count=attacker_count,
            defender_type=defender_type,
            defender_count=defender_count,
            effectiveness=effectiveness,
            damage=damage,
            killed=killed,
        )

    def _process_combat_phase(
        self,
        attacking_side: Dict[str, int],
        defending_side: Dict[str, int],
        current_attackers: Dict[str, int],
        current_defenders: Dict[str, int],
        result: SideResult,
        phase_name: str,
    ) -> List[str]:
        """
        Process a single combat phase (attacker or defender).

        Args:
            attacking_side: Original units for attacking side
            defending_side: Original units for defending side
            current_attackers: Current state of attacking units
            current_defenders: Current state of defending units
            result: SideResult object to update with casualties
            phase_name: Name of the phase for logging

        Returns:
            List of log messages for this phase
        """
        log_lines = [f"\n[bold cyan]{phase_name} Phase:[/bold cyan]"]

        for attacker_type in UNIT_ORDER:
            if (
                attacker_type not in attacking_side
                or attacking_side[attacker_type] <= 0
            ):
                continue

            current_count = current_attackers.get(attacker_type, 0)
            if current_count <= 0:
                continue

            log_lines.append(
                f"\n[yellow]{attacker_type} actions "
                f"(Score: {UNIT_SCORES[attacker_type]:,}):[/yellow]"
            )

            for defender_type in UNIT_ORDER:
                if (
                    defender_type not in defending_side
                    or defending_side[defender_type] <= 0
                ):
                    continue

                step = self.calculate_damage_step(
                    attacker_type,
                    current_attackers.get(attacker_type, 0),
                    defender_type,
                    current_defenders.get(defender_type, 0),
                )

                if step:
                    log_lines.append(
                        f"{step.attacker_count} {step.attacker_type} "
                        f"attack {step.defender_count} {step.defender_type} "
                        f"(effectiveness: {step.effectiveness:.3f}) "
                        f"dealing {step.damage:.1f} damage, "
                        f"killing {step.killed} units"
                    )

                    current_defenders[defender_type] -= step.killed
                    result.units_killed[defender_type] = (
                        result.units_killed.get(defender_type, 0) + step.killed
                    )

        return log_lines

    def simulate_battle(
        self, attacker_units: Dict[str, int], defender_units: Dict[str, int]
    ) -> BattleResult:
        """
        Simulate a complete battle between attackers and defenders.

        Args:
            attacker_units: Dictionary of attacker unit counts
            defender_units: Dictionary of defender unit counts

        Returns:
            BattleResult object containing all battle outcomes
        """
        result = BattleResult()

        # Initialize current unit states
        current_units = {
            "attackers": attacker_units.copy(),
            "defenders": defender_units.copy(),
        }

        # Log attack order
        result.battle_log.append(
            "[bold cyan]Unit Attack Order (weakest to strongest):[/bold cyan]"
        )
        for i, unit in enumerate(UNIT_ORDER, 1):
            result.battle_log.append(f"{i}. {unit} (Score: {UNIT_SCORES[unit]:,})")
        result.battle_log.append("")

        # Process attacker phase
        attacker_log = self._process_combat_phase(
            attacker_units,
            defender_units,
            current_units["attackers"],
            current_units["defenders"],
            result.defenders,
            "Attacker",
        )
        result.battle_log.extend(attacker_log)

        # Process defender phase
        defender_log = self._process_combat_phase(
            defender_units,
            attacker_units,
            current_units["defenders"],
            current_units["attackers"],
            result.attackers,
            "Defender",
        )
        result.battle_log.extend(defender_log)

        # Calculate survivors and score losses
        self._calculate_survivors_and_losses(attacker_units, result.attackers)
        self._calculate_survivors_and_losses(defender_units, result.defenders)

        return result

    @staticmethod
    def _calculate_survivors_and_losses(
        original_units: Dict[str, int], side_result: SideResult
    ) -> None:
        """
        Calculate survivors and score losses for a side.

        Args:
            original_units: Original unit counts
            side_result: SideResult object to update
        """
        for unit_type in UNIT_ORDER:
            if unit_type not in original_units:
                continue

            killed = side_result.units_killed.get(unit_type, 0)
            side_result.survivors[unit_type] = original_units[unit_type] - killed
            side_result.score_lost += killed * UNIT_SCORES.get(unit_type, 0)

    @staticmethod
    def calculate_land_capture(
        attacker_units: Dict[str, int], defender_land: int
    ) -> LandCapture:
        """
        Calculate land capture based on Grabber units.

        Args:
            attacker_units: Dictionary of attacker unit counts
            defender_land: Total defender land available

        Returns:
            LandCapture object with distribution breakdown
        """
        grabbers = attacker_units.get("Grabber", 0)

        if grabbers <= 0:
            return LandCapture()

        max_capture = min(grabbers * LAND_CAPTURE_RATE, defender_land)

        return LandCapture(
            metal=round(max_capture * 0.4),
            crystal=round(max_capture * 0.4),
            undeveloped=round(max_capture * 0.2),
        )


# ============================================================================
# USER INTERFACE
# ============================================================================


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

    def display_battle_log(self, log_lines: List[str]) -> None:
        """
        Display the battle log.

        Args:
            log_lines: List of log message strings
        """
        self.console.print("\n[bold cyan]Battle Log:[/bold cyan]")
        for line in log_lines:
            self.console.print(line)

    def display_force_summary(
        self, side_name: str, original_units: Dict[str, int], side_result: SideResult
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
                f"{score_lost:,}",
            )

        table.add_row(
            "[bold]TOTALS",
            "",
            "",
            "",
            f"[bold yellow]{total_initial_score:,}",
            f"[bold red]{total_lost_score:,}",
        )

        self.console.print(table)

    def display_land_capture(
        self, land_capture: LandCapture, defender_land: int
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
        table.add_row(
            "Undeveloped Land Captured", f"[yellow]{land_capture.undeveloped}[/yellow]"
        )
        table.add_row(
            "Total Land Captured", f"[bold green]{land_capture.total}[/bold green]"
        )

        self.console.print("\n")
        self.console.print(table)

    def display_results(
        self,
        attacker_units: Dict[str, int],
        defender_units: Dict[str, int],
        battle_result: BattleResult,
        land_capture: LandCapture,
        defender_land: int,
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


# ============================================================================
# MAIN APPLICATION
# ============================================================================


class BattleCalculatorApp:
    """Main application class that coordinates the battle calculator."""

    def __init__(self):
        """Initialize the application."""
        self.simulator = BattleSimulator()
        self.ui = BattleUI()

    def run(self) -> None:
        """Run the battle calculator application."""
        self.ui.display_title()

        # Get user input
        attacker_units = self.ui.get_unit_counts("attacker")
        defender_units = self.ui.get_unit_counts("defender")
        defender_land = self.ui.get_defender_land()

        # Simulate battle
        battle_result = self.simulator.simulate_battle(attacker_units, defender_units)

        # Calculate land capture
        land_capture = self.simulator.calculate_land_capture(
            attacker_units, defender_land
        )

        # Display results
        self.ui.display_results(
            attacker_units, defender_units, battle_result, land_capture, defender_land
        )


def main() -> None:
    """Entry point for the battle calculator."""
    app = BattleCalculatorApp()
    app.run()


if __name__ == "__main__":
    main()
