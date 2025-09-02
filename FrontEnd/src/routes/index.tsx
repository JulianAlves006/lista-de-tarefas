import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Tasks from '../pages/tasks';
import Login from '../pages/login';
import Register from '../pages/register';
import Task from '../pages/task';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Tasks />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />}/>
      <Route path='/task' element={<Task />} />
      <Route path='/task/:id' element={<Task />} />
    </Routes>
  );
}
