import React from 'react';
import { Scrollbar } from '@lotus-design/scrollbar';

import './style.less';
import '../../assets/style.less';

const Demo: React.FC = () => {
  return (
    <Scrollbar>
      <div className="scrollbar-demo-content">
        {Array.from({ length: 50 }, () => ({})).map((_, index) => {
          return (
            <p key={index} className="scrollbar-demo-horizontal-item">
              {index + 1}
            </p>
          );
        })}
      </div>
    </Scrollbar>
  );
};

export default Demo;
