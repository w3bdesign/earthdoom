import React from 'react';
import { render, screen } from '@testing-library/react';
import InputNumber from '../../components/ui/tables/AdvancedDataTable/InputNumber';
import { canAffordToTrain } from '../../utils/functions';

describe('InputNumber', () => {
  it('renders an input element with type number', () => {
    render(<InputNumber canAffordToTrain={canAffordToTrain} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
  });

  it('has default value of 0', () => {
    render(<InputNumber canAffordToTrain={canAffordToTrain} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('value', '0');
  });

  it('has min attribute set to 0', () => {
    render(<InputNumber canAffordToTrain={canAffordToTrain} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
  });

  it('has aria-label for accessibility', () => {
    render(<InputNumber canAffordToTrain={canAffordToTrain} />);
    const input = screen.getByLabelText('Amount');
    expect(input).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<InputNumber canAffordToTrain={canAffordToTrain} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has placeholder text "Amount"', () => {
    render(<InputNumber canAffordToTrain={canAffordToTrain} />);
    const input = screen.getByPlaceholderText('Amount');
    expect(input).toBeInTheDocument();
  });
});
