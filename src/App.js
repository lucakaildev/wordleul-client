import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import React, { createContext } from "react";
import "./app.css"
import AppContextProvider from "./components/Context/AppContext";

export const Context = createContext();

function App() {

  return (

    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home></Home>}></Route>
          <Route path="/unlimited" element={<Home></Home>}></Route>
          <Route path="/login" element={<Home></Home>}></Route>
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
