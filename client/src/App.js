import React from 'react';
import logo from './logo.svg';

import Home from "./components/home/home";
import  Login from "./components/login/login"
import './App.css';
import {BrowserRouter, Link, Route } from "react-router-dom";
import Main from "./components/main/main"; 
import Playlists from "./components/playlists/playlists"

function App() {
  return (
    <BrowserRouter>
      <Route path = "/" exact>  <Login/> </Route>
      <Route path = "/home"> <Home/> </Route>
      <Route path = "/main"> <Main/> </Route>
    </BrowserRouter>
  );
}

export default App;
