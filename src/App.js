import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ImageInput from './components/ImageInput';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' Component={ Home }/>
        <Route exact path='/photo' Component={ ImageInput } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
