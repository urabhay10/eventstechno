import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Scene from './components/Scene'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' element={<Scene/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
