import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TodosPage from './pages/TodosPage';
import TodoDetailPage from './pages/TodoDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodosPage />} />
        <Route path="/todo" element={<TodoDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
