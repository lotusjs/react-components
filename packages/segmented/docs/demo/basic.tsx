import React from 'react';
import { Segmented } from '@lotus-design/segmented';

import '../../assets/style.less';

const App: React.FC = () => {
  return (
    <div className="wrapper">
      <Segmented
        options={['iOS', 'Android', 'Web']}
        onChange={(value) => console.log(value, typeof value)}
      />
    </div>
  );
};

export default App;
