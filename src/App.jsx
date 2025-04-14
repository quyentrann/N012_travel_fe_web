import React from 'react';
import AppRouter from './router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './redux/userSlice';
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("App khởi động nèeee");
    const userInfo = localStorage.getItem('user_info');
    console.log("user_info trong App nèeee", userInfo);
    if (userInfo) {
      console.log("Dispatch initializeAuth nèeee");
      dispatch(initializeAuth({ user: JSON.parse(userInfo) }));
    }
  }, [dispatch]);
  return (
    <div>
      <AppRouter></AppRouter>
    </div>
  );
};

export default App;
