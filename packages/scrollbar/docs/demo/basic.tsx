import React from 'react';
import { Scrollbar } from '@lotus-design/scrollbar';

import './style.less';
import '../../assets/style.less';

const Demo: React.FC = () => {
  return (
    <Scrollbar height={400}>
      {Array.from({ length: 20 }, () => ({})).map((_, index) => {
        return (
          <p key={index} className="scrollbar-demo-item">
            {index + 1}
          </p>
        );
      })}
    </Scrollbar>
  );
};

export default Demo;
