import React from 'react';
import { symbolToDisplay } from '@/utils/symbolMapping';

export const withSymbolMapping = <P extends { symbol: string }>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithSymbolMapping: React.FC<P> = (props) => {
    // Only transform the symbol prop, pass everything else through unchanged
    const mappedProps = {
      ...props,
      symbol: symbolToDisplay(props.symbol)
    } as P;
    
    return <WrappedComponent {...mappedProps} />;
  };
  
  return WithSymbolMapping;
}; 