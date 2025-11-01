import React, { useState } from 'react';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (user) => {
    onLogin(user);
  };

  const handleSignup = (user) => {
    onLogin(user);
  };

  const switchToSignup = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isLogin ? (
        <Login 
          onLogin={handleLogin} 
          onSwitchToSignup={switchToSignup} 
        />
      ) : (
        <SignUp 
          onSignup={handleSignup} 
          onSwitchToLogin={switchToLogin} 
        />
      )}
    </div>
  );
};

export default Auth;

