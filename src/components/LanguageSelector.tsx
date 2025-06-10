import React from 'react';
import LanguageDropdown from './LanguageDropdown';

// Simple wrapper component to maintain compatibility
const LanguageSelector: React.FC = () => {
  return <LanguageDropdown />;
};

export default LanguageSelector;
