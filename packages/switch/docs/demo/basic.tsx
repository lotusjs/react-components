import React from 'react';
import { Switch } from '@lotus-design/switch';

import '../../assets/index.less';

const App: React.FC = () => {
  return (
    <>
      <Switch checkedText="开" unCheckedText="关" />
    </>
  );
};

export default App;
