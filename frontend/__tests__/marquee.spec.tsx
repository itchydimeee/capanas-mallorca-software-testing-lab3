import React from 'react';
import { render, screen, configure } from '@testing-library/react';
import PogMarquee from '../src/components/marquee';
import '@testing-library/jest-dom/extend-expect';

configure({
  window: Object.assign(window, {
    ResizeObserver: jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })),
  }),
});

const mockPogs = [
  {
    id: 1,
    ticker_symbol: 'P1',
    price: 10,
    prevPrice: 9,
  },
  {
    id: 2,
    ticker_symbol: 'P2',
    price: 20,
    prevPrice: 18,
  },
];

describe('PogMarquee Component', () => {
  it('renders a marquee with pog data', () => {
    render(<PogMarquee pogs={mockPogs} />);
  
    expect(screen.getAllByText('Pog Marquee')).toEqual(expect.arrayContaining([expect.objectContaining({ nodeName: 'H2' })]));
    expect(screen.getAllByText('P1 (11.11%)')).toEqual(expect.arrayContaining([expect.objectContaining({ nodeName: 'SPAN' })]));
    expect(screen.getAllByText('P2 (11.11%)')).toEqual(expect.arrayContaining([expect.objectContaining({ nodeName: 'SPAN' })]));
  });

  it('calculates percentage change correctly', () => {
    const pogMarquee = render(<PogMarquee pogs={mockPogs} />);
    const percentageChanges = pogMarquee.getAllByText(/%/);

    expect(percentageChanges[0]).toHaveTextContent('11.11%');
    expect(percentageChanges[1]).toHaveTextContent('11.11%');
  });
});