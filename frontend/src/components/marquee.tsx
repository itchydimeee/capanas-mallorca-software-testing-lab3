import React from 'react';
import Marquee from 'react-fast-marquee';
import { Pog } from '../components/types';

interface MarqueeProps {
  pogs: Pog[];
}

const PogMarquee: React.FC<MarqueeProps> = ({ pogs }) => {
  const calculatePercentageChange = (currentPrice: number, prevPrice: number | null) => {
    if (prevPrice === null || prevPrice === 0) {
      return '0.00%';
    }
    const percentageChange = ((currentPrice - prevPrice) / prevPrice) * 100;
    return `${percentageChange.toFixed(2)}%`;
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">Pog Marquee</h2>
      <Marquee gradient={false} speed={50}>
        {pogs.map((pog) => (
          <span key={pog.id} className="mx-4">
            {pog.ticker_symbol} ({calculatePercentageChange(pog.price, pog.prevPrice)})
          </span>
        ))}
      </Marquee>
    </div>
  );
};

export default PogMarquee;