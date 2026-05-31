# EarthDoom Battle Calculator

A professional, modular battle simulation tool for calculating combat outcomes, casualties, and land capture in EarthDoom battles.

## Features

- ✨ **Comprehensive Battle Simulation**: Simulates complete battles with all 10 unit types
- 📊 **Detailed Combat Analysis**: Tracks damage, casualties, and survivors for both sides
- 🏆 **Score Tracking**: Calculates total power scores and losses
- 🗺️ **Land Capture Mechanics**: Simulates land capture based on Grabber units
- 🎨 **Rich Console Output**: Beautiful formatted tables and color-coded results
- 🏗️ **Professional Architecture**: Clean, modular, DRY code structure
- 🔧 **Easy Configuration**: Separate config file for game balance adjustments

## Unit Types

The calculator supports all EarthDoom combat units (in attack order):

| Unit          | Score | Role                    |
| ------------- | ----- | ----------------------- |
| Infantry      | 250   | Basic ground unit       |
| Reaper        | 800   | Anti-unit specialist    |
| Shadows       | 1,000 | Stealth unit            |
| Avenger       | 1,400 | Tactical unit           |
| Grabber       | 1,600 | Land capture specialist |
| Cobra         | 3,000 | Heavy combat unit       |
| Goliaths      | 5,000 | Tank unit               |
| Hellspawn     | 5,000 | Elite combat unit       |
| LuciusStalker | 6,000 | Advanced hunter         |
| Ares          | 7,000 | Top-tier unit           |

## Installation

### Requirements

- Python 3.11 or higher
- [Rich](https://github.com/Textualize/rich) library

### Setup

1. **Clone or download** this repository to your local machine

2. **Install dependencies:**

   ```bash
   pip install rich
   ```

3. **Verify installation:**
   ```bash
   python battle_calc.py --help
   ```

## Usage

### Basic Usage

Run the calculator:

```bash
python battle_calc.py
```

You'll be prompted to enter:

1. **Attacker unit counts** - Number of each unit type for the attacking force
2. **Defender unit counts** - Number of each unit type for the defending force
3. **Defender's total land** - Used to calculate land capture

### Example Session

```
EarthDoom Battle Calculator

Enter attacker unit counts:
Number of Infantry [0]: 100
Number of Reaper [0]: 50
Number of Shadows [0]: 20
Number of Avenger [0]: 0
Number of Grabber [0]: 10
...

Enter defender unit counts:
Number of Infantry [0]: 80
Number of Reaper [0]: 30
...

Defender's total land [0]: 100
```

### Output

The calculator provides:

1. **Battle Log** - Detailed turn-by-turn combat breakdown showing:
   - Unit attack order
   - Individual unit actions per phase
   - Damage calculations and casualties

2. **Force Summary Tables** - For both attacker and defender:
   - Initial unit counts
   - Units lost in battle
   - Surviving units
   - Score values and losses

3. **Land Capture Results** - Shows:
   - Total defender land
   - Metal land captured (40%)
   - Crystal land captured (40%)
   - Undeveloped land captured (20%)
   - Total land captured

## Project Structure

The project follows a professional, modular architecture:

```
Battle calculator/
├── battle_calc.py      # Main entry point (50 lines)
├── game_config.py      # Game statistics and configuration
├── models.py           # Data models and classes
├── simulator.py        # Battle simulation engine
├── ui.py              # User interface module
└── README.md          # This file
```

### Module Descriptions

#### [`battle_calc.py`](battle_calc.py:1)

Main application entry point. Coordinates the battle calculator workflow.

#### [`game_config.py`](game_config.py:1)

Contains all game-related configuration:

- Unit definitions and scores
- Combat effectiveness matrix
- Land capture rates
- Game balance settings

**Modify this file** to adjust game balance without touching core logic.

#### [`models.py`](models.py:1)

Data classes representing battle entities:

- `DamageStep` - Single combat calculation
- `SideResult` - Battle results for one side
- `BattleResult` - Complete battle outcomes
- `LandCapture` - Land distribution data

#### [`simulator.py`](simulator.py:1)

Core battle simulation engine:

- Combat effectiveness calculations
- Damage resolution
- Battle phase processing
- Land capture mechanics

#### [`ui.py`](ui.py:1)

User interface and display logic:

- Interactive input prompts
- Formatted table output
- Battle log display
- Results presentation

## Battle Mechanics

### Combat Resolution

1. **Attack Order**: Units attack in order from weakest to strongest (by score)
2. **Two-Phase Combat**:
   - **Attacker Phase**: All attacking units deal damage to defenders
   - **Defender Phase**: Surviving defenders retaliate
3. **Damage Calculation**: `damage = unit_count × effectiveness`
4. **Casualties**: Units are killed based on damage dealt (rounded down)

### Combat Effectiveness

Each unit has specific effectiveness values against other units. The combat effectiveness matrix in [`game_config.py`](game_config.py:1) defines these relationships.

**Example**:

- Infantry vs Goliaths: 1.6 effectiveness (very effective)
- Infantry vs Reaper: 0.005 effectiveness (nearly ineffective)

### Land Capture

- **Capture Rate**: 10% of defender's land per Grabber unit
- **Distribution**: Captured land is split:
  - 40% Metal land
  - 40% Crystal land
  - 20% Undeveloped land

## Customization

### Modifying Unit Stats

Edit [`game_config.py`](game_config.py:1) to adjust:

- Unit scores
- Combat effectiveness values
- Land capture rates
- Land distribution percentages

The configuration includes validation to ensure data integrity.

### Extending Functionality

The modular architecture makes it easy to add features:

- Add new unit types in `game_config.py`
- Extend `BattleSimulator` for new combat mechanics
- Customize `BattleUI` for different output formats
- Add new data models in `models.py`

## Code Quality

This project follows professional software engineering practices:

- ✅ **DRY Principle**: No code duplication
- ✅ **Single Responsibility**: Each module has one clear purpose
- ✅ **Type Hints**: Full type annotations for better IDE support
- ✅ **Documentation**: Comprehensive docstrings
- ✅ **Separation of Concerns**: Logic, UI, and data are separated
- ✅ **Reusable Classes**: Easy to integrate into other projects
- ✅ **Maintainable**: Clear structure for easy updates

## Development

### Running Tests

To verify the calculator works correctly:

```bash
python battle_calc.py
```

Enter test values and verify output matches expected results.

### Code Structure Principles

1. **Configuration Separate from Logic**: Game data in `game_config.py`
2. **Data Models Isolated**: All data structures in `models.py`
3. **Business Logic Encapsulated**: Simulation in `simulator.py`
4. **UI Separated**: All display logic in `ui.py`
5. **Thin Entry Point**: Main file just coordinates components

## Contributing

When contributing:

1. Maintain the modular structure
2. Add type hints to new code
3. Include docstrings for classes and methods
4. Update README if adding features
5. Keep configuration in `game_config.py`

## License

This is a tool for the EarthDoom game. Use freely for game strategy and planning.

## Support

For issues or questions:

- Check this README for usage instructions
- Review the code documentation
- Verify your Python and Rich versions meet requirements

## Version History

### v2.0 (Current)

- ✨ Complete refactor to professional, modular architecture
- ✨ Separated configuration, models, simulation, and UI
- ✨ Added comprehensive documentation
- ✨ Implemented DRY principles throughout
- ✨ Type hints and docstrings for all components

### v1.0

- Initial implementation with basic functionality
- All code in single file
- Basic battle simulation and display

---

**Built with:** Python 3.10+ | [Rich](https://github.com/Textualize/rich) library

**Architecture:** Modular | Object-Oriented | Professional
