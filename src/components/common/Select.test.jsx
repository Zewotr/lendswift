import { render, screen } from '@testing-library/react';
import Select from './Select';

describe('Select Component', () => {
  const options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
  ];

  it('renders all options', () => {
    render(<Select label="Choose" name="choose" options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Select label="Choose" name="choose" options={options} error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
});