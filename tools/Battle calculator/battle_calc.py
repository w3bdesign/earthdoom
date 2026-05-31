"""
EarthDoom Battle Calculator

A professional battle simulation tool for calculating combat outcomes,
casualties, and land capture in EarthDoom battles.

Main entry point for the application.
"""

from simulator import BattleSimulator
from ui import BattleUI


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
        battle_result = self.simulator.simulate_battle(
            attacker_units, defender_units
        )
        
        # Calculate land capture
        land_capture = self.simulator.calculate_land_capture(
            attacker_units, defender_land
        )
        
        # Display results
        self.ui.display_results(
            attacker_units,
            defender_units,
            battle_result,
            land_capture,
            defender_land
        )


def main() -> None:
    """Entry point for the battle calculator."""
    app = BattleCalculatorApp()
    app.run()


if __name__ == "__main__":
    main()
