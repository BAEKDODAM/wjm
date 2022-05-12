import './App.scss';
import { First } from './pages/first';
import React, {useEffect} from 'react';
import {Nav} from './components/Nav';
import { Home } from './pages/home';

function App() {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });
  return (
    <div><Home/></div>
  );
}

export default App;
