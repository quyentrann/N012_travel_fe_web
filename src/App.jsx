import React from 'react';
import { Link } from 'react-router-dom';
import AppRouter from './router';

const App = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">User</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>

      <AppRouter></AppRouter>
    </div>
  );
};

export default App;
