import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButton from '../../components/ui/tables/AdvancedDataTable/ActionButton';
import { createMockPaPlayer } from '../../test-utils/players';
import type { Building } from '../../components/features/Construct/types/types';

jest.mock('../../components/ui/notifications/ToastComponent', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import ToastComponent from '../../components/ui/notifications/ToastComponent';
const mockToast = ToastComponent as jest.Mock;

describe('ActionButton', () => {
  const mockMutate = jest.fn();

  const createBuilding = (overrides: Partial<Building> = {}): Building => ({
    buildingId: 1,
    buildingName: 'Test Building',
    buildingDescription: 'A test building',
    buildingFieldName: 'c_crystal',
    buildingETA: 3,
    buildingCost: '100 credits',
    buildingCostCrystal: 100,
    buildingCostTitanium: 50,
    needsFieldName: 0,
    hasInputField: 'undefined',
    ...overrides,
  });

  const defaultPlayer = createMockPaPlayer({ crystal: 5000, metal: 3000 });
  const defaultBuilding = createBuilding();

  const defaultProps = {
    isLoading: false,
    paPlayer: [defaultPlayer],
    building: defaultBuilding,
    mutate: mockMutate,
    actionText: 'Build',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when player is undefined', () => {
    const { container } = render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} paPlayer={[]} />
      </tr></tbody></table>
    );
    expect(container.querySelector('td')).toBeNull();
  });

  it('renders null when building is undefined', () => {
    const { container } = render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} building={undefined} />
      </tr></tbody></table>
    );
    expect(container.querySelector('td')).toBeNull();
  });

  it('renders a Build button when player can afford it', () => {
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} />
      </tr></tbody></table>
    );
    expect(screen.getByRole('button', { name: 'Build' })).toBeInTheDocument();
  });

  it('disables button when isLoading is true', () => {
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} isLoading={true} />
      </tr></tbody></table>
    );
    expect(screen.getByRole('button', { name: 'Build' })).toBeDisabled();
  });

  it('disables button when disabled prop is true', () => {
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} disabled={true} />
      </tr></tbody></table>
    );
    expect(screen.getByRole('button', { name: 'Build' })).toBeDisabled();
  });

  it('disables button when player cannot afford the building', () => {
    const poorPlayer = createMockPaPlayer({ crystal: 0, metal: 0 });
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} paPlayer={[poorPlayer]} />
      </tr></tbody></table>
    );
    expect(screen.getByRole('button', { name: 'Build' })).toBeDisabled();
  });

  it('calls mutate with correct parameters when clicked', () => {
    const building = createBuilding({ hasInputField: 'undefined', needsFieldName: 0 });
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} building={building} />
      </tr></tbody></table>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Build' }));
    expect(mockMutate).toHaveBeenCalledWith({
      buildingFieldName: 'c_crystal',
      buildingETA: 3,
      buildingCostCrystal: 100,
      buildingCostTitanium: 50,
      unitAmount: 0,
    });
  });

  it('shows toast error when hasInputField and amount is 0', () => {
    const building = createBuilding({ hasInputField: 1 });
    const inputRef = React.createRef<HTMLInputElement>();
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} building={building} inputAmountRef={inputRef} />
      </tr></tbody></table>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Build' }));
    expect(mockToast).toHaveBeenCalledWith({
      message: 'Quantity needs to be more than 0',
      type: 'error',
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows toast error when player cannot afford the amount', () => {
    const poorPlayer = createMockPaPlayer({ crystal: 50, metal: 30 });
    const building = createBuilding({ hasInputField: 1, buildingCostCrystal: 100, buildingCostTitanium: 50 });
    const inputRef = { current: { value: '5' } } as React.RefObject<HTMLInputElement>;
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} paPlayer={[poorPlayer]} building={building} inputAmountRef={inputRef} />
      </tr></tbody></table>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Build' }));
    expect(mockToast).toHaveBeenCalledWith({
      message: 'You can not afford this',
      type: 'error',
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows status text when building is in progress', () => {
    const building = createBuilding({ needsFieldName: 1, buildingFieldName: 'c_crystal' });
    const player = createMockPaPlayer({ crystal: 5000, metal: 3000, c_crystal: 5 });
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} paPlayer={[player]} building={building} />
      </tr></tbody></table>
    );
    expect(screen.getByText('5 ticks left')).toBeInTheDocument();
  });

  it('shows "Done" when building field value is 1', () => {
    const building = createBuilding({ needsFieldName: 1, buildingFieldName: 'c_crystal' });
    const player = createMockPaPlayer({ crystal: 5000, metal: 3000, c_crystal: 1 });
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} paPlayer={[player]} building={building} />
      </tr></tbody></table>
    );
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('shows button when needsFieldName is 0 (skip field name check)', () => {
    const building = createBuilding({ needsFieldName: 0 });
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} building={building} />
      </tr></tbody></table>
    );
    expect(screen.getByRole('button', { name: 'Build' })).toBeInTheDocument();
  });

  it('shows button when building field value is 0 and needsFieldName is set', () => {
    const building = createBuilding({ needsFieldName: 1, buildingFieldName: 'c_crystal' });
    const player = createMockPaPlayer({ crystal: 5000, metal: 3000, c_crystal: 0 });
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} paPlayer={[player]} building={building} />
      </tr></tbody></table>
    );
    expect(screen.getByRole('button', { name: 'Build' })).toBeInTheDocument();
  });

  it('hides button when building is already in progress and needsFieldName is set', () => {
    const building = createBuilding({ needsFieldName: 1, buildingFieldName: 'c_crystal' });
    const player = createMockPaPlayer({ crystal: 5000, metal: 3000, c_crystal: 3 });
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} paPlayer={[player]} building={building} />
      </tr></tbody></table>
    );
    expect(screen.queryByRole('button', { name: 'Build' })).not.toBeInTheDocument();
  });

  it('renders tooltip when player cannot afford building', () => {
    const poorPlayer = createMockPaPlayer({ crystal: 10, metal: 5 });
    const building = createBuilding({ buildingCostCrystal: 100, buildingCostTitanium: 50 });
    const { container } = render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} paPlayer={[poorPlayer]} building={building} />
      </tr></tbody></table>
    );
    const tooltipDiv = container.querySelector('[title]');
    expect(tooltipDiv).toBeInTheDocument();
    expect(tooltipDiv?.getAttribute('title')).toContain('Need');
  });

  it('renders tooltip with "Action in progress..." when isLoading', () => {
    const { container } = render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} isLoading={true} />
      </tr></tbody></table>
    );
    const tooltipDiv = container.querySelector('[title]');
    expect(tooltipDiv?.getAttribute('title')).toBe('Action in progress...');
  });

  it('renders no tooltip when player can afford building and not loading', () => {
    const { container } = render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} />
      </tr></tbody></table>
    );
    const tooltipDiv = container.querySelector('[title]');
    // title should be undefined/empty when affordable
    expect(tooltipDiv?.getAttribute('title')).toBeFalsy();
  });

  it('uses actionText prop for button label', () => {
    render(
      <table><tbody><tr>
        <ActionButton {...defaultProps} actionText="Train" />
      </tr></tbody></table>
    );
    expect(screen.getByRole('button', { name: 'Train' })).toBeInTheDocument();
  });
});
