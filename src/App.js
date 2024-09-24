import logo from './logo.svg';
import '../src/index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeroComponent from './Views/Heroindex';
import PublisherDetail from './Views/PublisherDetail';
import GenderDetail from './Views/GerderDetail';
import AlignmentDetail from './Views/AligmentDetail';
function App() {
  return (
    <div >
      <Router>
            <Routes>
                <Route path="/" element={<HeroComponent />} />
                <Route path="/publisher/:houseName" element={<PublisherDetail />} />
                <Route path="/gender/:genderName" element={<GenderDetail />} /> 
                <Route path="/alignment/:alignmentName" element={<AlignmentDetail />} /> {/* Nueva ruta para AlignmentDetail */}
            </Routes>
        </Router>
    </div>
  );
}

export default App;
