"""
Data Models for EarthDoom Battle Calculator

Contains all data classes representing battle entities and results.
"""

from typing import Dict
from dataclasses import dataclass, field


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
    battle_log: list[str] = field(default_factory=list)


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
