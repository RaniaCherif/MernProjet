import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Trending from "./pages/Trending";

const App = () => {
       return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/trending" element={<Trending />} />
        <Route path='*' element={<h1>404 Not Found</h1>}></Route>
      </Routes>
  );
};
    

export default App;


