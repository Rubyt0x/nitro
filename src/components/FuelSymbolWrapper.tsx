import React from 'react';
import { isFuelSymbol } from '@/utils/symbolMapping';

interface FuelSymbolWrapperProps {
  symbol: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FuelSymbolWrapper: React.FC<FuelSymbolWrapperProps> = ({ 
  symbol, 
  className = '', 
  style = {} 
}) => {
  // Only intercept fuel symbols, pass through everything else unchanged
  if (isFuelSymbol(symbol)) {
    return (
      <div 
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ 
          width: '1em', 
          height: '1em', 
          ...style 
        }}
      >
        <img 
          src="/images/fuel-logo.png"
          alt="Fuel Token"
          className="w-full h-full object-contain"
          style={{ margin: '0', padding: '0' }}
        />
      </div>
    );
  }
  
  // Return original symbol unchanged for all other cases
  return <span className={className} style={style}>{symbol}</span>;
}; 