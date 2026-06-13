import Wizard from './components/wizard/Wizard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Wizard />} />
      </Routes>
    </Router>
  );
}

export default App;