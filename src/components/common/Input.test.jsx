import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input Component', () => {
  it('renders with label and required indicator', () => {
    render(<Input label="Full Name" name="fullName" required error="" />);
    expect(screen.getByLabelText(/Full Name \*/)).toBeInTheDocument();
  });

  it('displays error message when error prop provided', () => {
    render(<Input label="Email" name="email" error="Invalid email" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });

  it('calls ref and onChange correctly', () => {
    const handleChange = vi.fn();
    render(<Input label="Test" name="test" onChange={handleChange} />);
    const input = screen.getByLabelText('Test');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalled();
  });
});