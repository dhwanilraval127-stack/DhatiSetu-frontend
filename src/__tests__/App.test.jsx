import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { LocationProvider } from '../context/LocationContext';
import App from '../App';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <LocationProvider>
          {component}
        </LocationProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('App Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(document.querySelector('#root')).toBeDefined();
  });
});