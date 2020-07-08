import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import Home from "./components/home/home";
import  Login from "./components/login/login"
import './App.css';
import {BrowserRouter, Link, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Route path = "/" exact>  <Login/> </Route>
      <Route path = "/home"> <Home/> </Route>
    
    
    </BrowserRouter>
  );
}

export default App;
