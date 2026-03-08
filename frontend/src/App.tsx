import './App.css'
import NavBar from './components/NavBar/NavBar';
import Login from './pages/Login/Login';
import Match from './pages/Match/Match';

function App() {

  return (
    <>
      <div>
        <Login />
        <Match />
        <NavBar />
      </div>
    </>
  )
}

export default App
