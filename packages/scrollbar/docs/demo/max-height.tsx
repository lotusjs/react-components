import React, { useState } from 'react';
import { Space, Button } from 'antd';

import { Scrollbar } from '@lotus-design/scrollbar';

import './style.less';
import '../../assets/style.less';

const Demo: React.FC = () => {
  const [count, setCount] = useState(3);

  const handleAdd = () => {
    setCount((count) => count + 1);
  };
  const handleDelete = () => {
    if (count > 0) {
      setCount((count) => count - 1);
    }
  };

  return (
    <>
      <Space>
        <Button onClick={handleAdd}>Add Item</Button>
        <Button onClick={handleDelete}>Delete Item</Button>
      </Space>
      <Scrollbar maxHeight={400}>
        {Array.from({ length: count }, () => ({})).map((_, index) => {
          return (
            <p key={index} className="scrollbar-demo-item">
              {index + 1}
            </p>
          );
        })}
      </Scrollbar>
    </>
  );
};

export default Demo;
