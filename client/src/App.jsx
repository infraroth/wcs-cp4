// eslint-disable-next-line arrow-body-style
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext.js';
import { UserContext } from './contexts/UserContext.js';
import ArtContext from './contexts/ArtContext.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import './App.css';

import axios from 'axios';
import { useEffect, useState } from 'react';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  const [art, setArt] = useState([]);

  useEffect(() => {
    getArt();
    getUser();
  }, []);

  const getArt = () => {
    axios.get('http://localhost:8000/art').then(({ data }) => {
      setArt(data);
    });
  };

  const getUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:8000/user/', {
          headers: {
            'x-access-token': token,
          },
        })
        .then(({ data }) => {
          if (data.auth) {
            setIsAuthenticated(true);
            setUser(JSON.parse(localStorage.getItem('user')));
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  };
  return (
    <div className="App">
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <UserContext.Provider value={{ user, setUser }}>
          <ArtContext.Provider value={{ art: art }}>
            <Router>
              <Header />
              <main id="main" className="site-main" role="main">
                <Routes>
                  <Route exact path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/account" element={<ProtectedRoute />}>
                    <Route path="/account" element={<UserDashboard />} />
                  </Route>
                </Routes>
              </main>
            </Router>
          </ArtContext.Provider>
        </UserContext.Provider>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
