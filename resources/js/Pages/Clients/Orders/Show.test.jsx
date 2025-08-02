import { render, screen, fireEvent } from '@testing-library/react';
import Show from './Show';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../lib/i18n';

describe('Order Show Page Review Flow', () => {
  it('shows review form if can_review', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Show order={{ id: 1 }} can_review={true} can_chat={true} />
      </I18nextProvider>
    );
    expect(screen.getByText(/Submit Review/i)).toBeInTheDocument();
  });

  it('shows review card if review exists', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Show order={{ id: 1 }} review={{ rating: 5, comment: 'Great!' }} />
      </I18nextProvider>
    );
    expect(screen.getByText(/Great!/i)).toBeInTheDocument();
  });

  it('shows chat closed message if !can_chat', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Show order={{ id: 1 }} can_chat={false} />
      </I18nextProvider>
    );
    expect(screen.getByText(/Chat is closed/i)).toBeInTheDocument();
  });
}); 