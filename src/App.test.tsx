import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('<App />', () => {
  it('renders correctly', () => {
    render(<App />);
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Vite + React');
  });

  it('increases count when clicked on button', async () => {
    render(<App />);

    const button = screen.getByRole('button', { name: 'count is 0' });

    await userEvent.click(button);

    await waitFor(() => expect(button).toHaveTextContent('count is 1'));
  });
});
