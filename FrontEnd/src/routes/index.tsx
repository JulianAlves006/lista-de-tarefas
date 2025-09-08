
import { Routes, Route } from 'react-router-dom';

import Tasks from '../pages/tasks';
import Login from '../pages/login';
import Register from '../pages/register';
import Task from '../pages/task';
import PageNotFound from '../pages/404';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/tasks' element={<Tasks />} />
      <Route path='/register' element={<Register />}/>
      <Route path='/task' element={<Task />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
