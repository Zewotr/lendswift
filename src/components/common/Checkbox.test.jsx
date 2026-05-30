import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Checkbox from './Checkbox';

describe('Checkbox Component', () => {
  it('renders with label', () => {
    render(<Checkbox label="I agree" name="agree" />);
    expect(screen.getByLabelText('I agree')).toBeInTheDocument();
  });

  it('can be checked', () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Accept" name="accept" onChange={handleChange} />);
    const checkbox = screen.getByLabelText('Accept');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows required indicator', () => {
    render(<Checkbox label="Required field" name="req" required />);
    expect(screen.getByText(/\*/)).toBeInTheDocument();
  });
});