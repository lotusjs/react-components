import * as React from 'react';
import DumiSearchBar from 'dumi/theme-default/slots/SearchBar';

export interface HeaderProps {}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header>
      <DumiSearchBar />
    </header>
  );
};

export default Header;
