import React from 'react';
import { Row, Col } from 'antd';
import { Scrollbar } from '@lotus-design/scrollbar';

import './style.less';
import '../../assets/style.less';

const Demo: React.FC = () => {
  return (
    <Row>
      <Col span={12}>
        <Scrollbar height={400}>
          {Array.from({ length: 20 }, () => ({})).map((_, index) => {
            return (
              <p key={index} className="scrollbar-demo-item">
                {index + 1}
              </p>
            );
          })}
        </Scrollbar>
      </Col>
      <Col span={12}>
        <Scrollbar height={400} size="small">
          {Array.from({ length: 20 }, () => ({})).map((_, index) => {
            return (
              <p key={index} className="scrollbar-demo-item">
                {index + 1}
              </p>
            );
          })}
        </Scrollbar>
      </Col>
    </Row>
  );
};

export default Demo;
