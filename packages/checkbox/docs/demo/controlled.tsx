import React from 'react';
import { useBoolean } from '@pansy/react-hooks';
import { Checkbox } from '@lotus-design/checkbox';

const App: React.FC = () => {
  const [disabled] = useBoolean();

  const handleChange = (e: any) => {
    console.log('Checkbox checked:', e.target.checked);
  };

  return (
    <>
      <label>
        <Checkbox checked onChange={handleChange} disabled={disabled} />
        &nbsp; controlled checked @lotus-design/checkbox
      </label>
      <br />
      <label>
        <input checked type="checkbox" onChange={handleChange} disabled={disabled} />
        &nbsp; controlled checked native
      </label>
    </>
  );
};

export default App;
