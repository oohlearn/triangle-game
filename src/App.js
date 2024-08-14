import React, { useState, useEffect } from 'react';
import {Route, Routes} from "react-router-dom"
import Board from './components/Board';
import Index from './components/Index';
import Test from './components/Test';
import Test2 from './components/Test2';
import Test3 from './components/Test3';
import Test4 from './components/Test4';




const App = () => {
  

  return (
    <div >
    <Routes>
      <Route path='/' element={<Index/>}></Route>
      <Route path='test' element={<Test/>}></Route>
      <Route path='board' element={<Board/>}></Route>
      <Route path='test-2' element={<Test2/>}></Route>
      <Route path='test-3' element={<Test3/>}></Route>
      <Route path='test-4' element={<Test4/>}></Route>




    </Routes>
    </div>
  );
};

export default App;