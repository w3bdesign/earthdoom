"""
Battle Simulation Engine

Handles all battle logic including damage calculations,
combat resolution, and land capture mechanics.
"""

from typing import Dict, List, Optional
from rich.console import Console

from models import DamageStep, BattleResult, SideResult, LandCapture
from game_config import (
    UNIT_ORDER,
    UNIT_SCORES,
    COMBAT_STATS,
    LAND_CAPTURE_RATE,
    LAND_DISTRIBUTION
)


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
        attacker_type: str,
        attacker_count: int,
        defender_type: str,
        defender_count: int
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
            killed=killed
        )
    
    def _process_combat_phase(
        self,
        attacking_side: Dict[str, int],
        defending_side: Dict[str, int],
        current_attackers: Dict[str, int],
        current_defenders: Dict[str, int],
        result: SideResult,
        phase_name: str
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
            if attacker_type not in attacking_side or attacking_side[attacker_type] <= 0:
                continue
            
            current_count = current_attackers.get(attacker_type, 0)
            if current_count <= 0:
                continue
            
            log_lines.append(
                f"\n[yellow]{attacker_type} actions "
                f"(Score: {UNIT_SCORES[attacker_type]:,}):[/yellow]"
            )
            
            for defender_type in UNIT_ORDER:
                if defender_type not in defending_side or defending_side[defender_type] <= 0:
                    continue
                
                step = self.calculate_damage_step(
                    attacker_type,
                    current_attackers.get(attacker_type, 0),
                    defender_type,
                    current_defenders.get(defender_type, 0)
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
        self,
        attacker_units: Dict[str, int],
        defender_units: Dict[str, int]
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
            'attackers': attacker_units.copy(),
            'defenders': defender_units.copy()
        }
        
        # Log attack order
        result.battle_log.append(
            "[bold cyan]Unit Attack Order (weakest to strongest):[/bold cyan]"
        )
        for i, unit in enumerate(UNIT_ORDER, 1):
            result.battle_log.append(
                f"{i}. {unit} (Score: {UNIT_SCORES[unit]:,})"
            )
        result.battle_log.append("")
        
        # Process attacker phase
        attacker_log = self._process_combat_phase(
            attacker_units, defender_units,
            current_units['attackers'], current_units['defenders'],
            result.defenders, "Attacker"
        )
        result.battle_log.extend(attacker_log)
        
        # Process defender phase
        defender_log = self._process_combat_phase(
            defender_units, attacker_units,
            current_units['defenders'], current_units['attackers'],
            result.attackers, "Defender"
        )
        result.battle_log.extend(defender_log)
        
        # Calculate survivors and score losses
        self._calculate_survivors_and_losses(
            attacker_units, result.attackers
        )
        self._calculate_survivors_and_losses(
            defender_units, result.defenders
        )
        
        return result
    
    @staticmethod
    def _calculate_survivors_and_losses(
        original_units: Dict[str, int],
        side_result: SideResult
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
        attacker_units: Dict[str, int],
        defender_land: int
    ) -> LandCapture:
        """
        Calculate land capture based on Grabber units.
        
        Args:
            attacker_units: Dictionary of attacker unit counts
            defender_land: Total defender land available
        
        Returns:
            LandCapture object with distribution breakdown
        """
        grabbers = attacker_units.get('Grabber', 0)
        
        if grabbers <= 0:
            return LandCapture()
        
        max_capture = min(grabbers * LAND_CAPTURE_RATE, defender_land)
        
        return LandCapture(
            metal=round(max_capture * LAND_DISTRIBUTION['metal']),
            crystal=round(max_capture * LAND_DISTRIBUTION['crystal']),
            undeveloped=round(max_capture * LAND_DISTRIBUTION['undeveloped'])
        )
