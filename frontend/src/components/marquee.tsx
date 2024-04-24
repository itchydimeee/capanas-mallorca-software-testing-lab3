import React from 'react';
import Marquee from 'react-fast-marquee';
import { Pog } from '../screens/user';

interface MarqueeProps {
  pogs: Pog[];
}

const PogMarquee: React.FC<MarqueeProps> = ({ pogs }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">Pog Marquee</h2>
      <Marquee gradient={false} speed={50}>
        {pogs.map((pog) => (
          <span key={pog.id} className="mx-4">
            {pog.ticker_symbol}
          </span>
        ))}
      </Marquee>
    </div>
  );
};

export default PogMarquee;