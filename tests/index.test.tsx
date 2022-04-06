/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../pages/home';

describe('Home', () => {
  it('renders', () => {
    render(<Home />);
  });
});
