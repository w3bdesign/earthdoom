"""
EarthDoom Game Configuration

Contains all unit statistics, combat effectiveness values, and game constants.
This module can be easily modified to adjust game balance without touching the core logic.
"""

from typing import Dict, List


# ============================================================================
# UNIT CONFIGURATION
# ============================================================================

# Units ordered from weakest to strongest (determines attack order in battle)
UNIT_ORDER: List[str] = [
    'Infantry',      # 250
    'Reaper',        # 800
    'Shadows',       # 1000
    'Avenger',       # 1400
    'Grabber',       # 1600
    'Cobra',         # 3000
    'Goliaths',      # 5000
    'Hellspawn',     # 5000
    'LuciusStalker', # 6000
    'Ares',          # 7000
]

# Power score value for each unit type
UNIT_SCORES: Dict[str, int] = {
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


# ============================================================================
# COMBAT EFFECTIVENESS MATRIX
# ============================================================================

# Combat effectiveness: COMBAT_STATS[attacker][defender] = effectiveness multiplier
# Higher values mean more damage dealt per attacking unit
# 0 means no damage capability
COMBAT_STATS: Dict[str, Dict[str, float]] = {
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


# ============================================================================
# GAME MECHANICS
# ============================================================================

# Land capture rate: 10% of defender's land per Grabber unit
LAND_CAPTURE_RATE: float = 0.1

# Land distribution percentages when captured
LAND_DISTRIBUTION: Dict[str, float] = {
    'metal': 0.4,      # 40% metal land
    'crystal': 0.4,    # 40% crystal land
    'undeveloped': 0.2 # 20% undeveloped land
}


# ============================================================================
# VALIDATION
# ============================================================================

def validate_config() -> None:
    """
    Validate configuration integrity.
    Raises ValueError if configuration is invalid.
    """
    # Verify all units in UNIT_ORDER have scores
    for unit in UNIT_ORDER:
        if unit not in UNIT_SCORES:
            raise ValueError(f"Unit '{unit}' in UNIT_ORDER missing from UNIT_SCORES")
    
    # Verify all units with scores are in UNIT_ORDER
    for unit in UNIT_SCORES:
        if unit not in UNIT_ORDER:
            raise ValueError(f"Unit '{unit}' in UNIT_SCORES missing from UNIT_ORDER")
    
    # Verify combat stats contain valid unit types
    for attacker in COMBAT_STATS:
        if attacker not in UNIT_ORDER:
            raise ValueError(f"Unknown attacker unit '{attacker}' in COMBAT_STATS")
        for defender in COMBAT_STATS[attacker]:
            if defender not in UNIT_ORDER:
                raise ValueError(f"Unknown defender unit '{defender}' in COMBAT_STATS")
    
    # Verify land distribution sums to 1.0
    total_distribution = sum(LAND_DISTRIBUTION.values())
    if abs(total_distribution - 1.0) > 0.001:
        raise ValueError(
            f"LAND_DISTRIBUTION must sum to 1.0, got {total_distribution}"
        )


# Validate on import
validate_config()
