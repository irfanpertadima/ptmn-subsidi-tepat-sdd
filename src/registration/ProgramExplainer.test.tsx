import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProgramExplainer } from './ProgramExplainer';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

beforeEach(() => push.mockClear());

describe('program explanation precedes data collection (control: PDP-LAWFUL-BASIS)', () => {
  it('explains the program, duration, and outcome', () => {
    render(<ProgramExplainer />);
    expect(screen.getByText(/Tentang Program Subsidi Tepat/)).toBeInTheDocument();
    expect(screen.getByText(/3-5 hari kerja/)).toBeInTheDocument();
    expect(screen.getByText(/kode QR yang dapat diunduh/)).toBeInTheDocument();
  });

  it('renders no input that collects personal data', () => {
    render(<ProgramExplainer />);
    // The only inputs are the vehicle-type radios, which are not personal data.
    const inputs = screen.getAllByRole('radio');
    expect(inputs).toHaveLength(2);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});

describe('document checklist by vehicle type', () => {
  it('lists KTP and STNK for Roda 2', async () => {
    const user = userEvent.setup();
    render(<ProgramExplainer />);
    await user.click(screen.getByRole('radio', { name: /Roda 2/ }));

    expect(screen.getByText('KTP asli')).toBeInTheDocument();
    expect(screen.getByText('STNK kendaraan')).toBeInTheDocument();
    expect(screen.queryByText(/Foto kendaraan/)).not.toBeInTheDocument();
  });

  it('adds vehicle photographs for Roda 4', async () => {
    const user = userEvent.setup();
    render(<ProgramExplainer />);
    await user.click(screen.getByRole('radio', { name: /Roda 4/ }));

    expect(screen.getByText('KTP asli')).toBeInTheDocument();
    expect(screen.getByText(/Foto kendaraan/)).toBeInTheDocument();
  });
});

describe('vehicle type is required', () => {
  it('refuses to advance with none chosen, and says which', async () => {
    const user = userEvent.setup();
    render(<ProgramExplainer />);
    await user.click(screen.getByRole('button', { name: 'Lanjutkan' }));

    expect(screen.getByText('Pilih jenis kendaraan terlebih dahulu')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it('moves focus to the choice when refused', async () => {
    const user = userEvent.setup();
    render(<ProgramExplainer />);
    await user.click(screen.getByRole('button', { name: 'Lanjutkan' }));
    expect(screen.getByRole('radio', { name: /Roda 2/ })).toHaveFocus();
  });

  it('carries the choice forward in the query string', async () => {
    const user = userEvent.setup();
    render(<ProgramExplainer />);
    await user.click(screen.getByRole('radio', { name: /Roda 4/ }));
    await user.click(screen.getByRole('button', { name: 'Lanjutkan' }));
    expect(push).toHaveBeenCalledWith('/daftar/persetujuan?jenis=roda4');
  });

  it('announces the step position', () => {
    render(<ProgramExplainer />);
    expect(screen.getByRole('status')).toHaveTextContent('Langkah 1 dari 5');
  });
});
