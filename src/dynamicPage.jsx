import React from 'react';
import { useLocation } from 'react-router-dom';

const DynamicPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const did = params.get('did');

  return (
    <div>
      <h1>Dynamic Page</h1>
      <p>Work Data ID: {did}</p>
      {/* Add more content as needed */}
    </div>
  );
};

export default DynamicPage;
