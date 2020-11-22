import React, { useState } from 'react';
import { View } from 'react-native';
import Login from './src/components/Login';
import Home from './src/components/Home';

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  return <View>{isLogin ? <Home /> : <Login />}</View>;
}
