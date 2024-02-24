import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Header from './Components/Header'

export default function App() {
  return <BrowserRouter>
  <Header/>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='signin' element={<SignIn/>}></Route>
      <Route path='signup' element={<SignUp/>}></Route>
      <Route path='about' element={<About/>}></Route>
      <Route path='profile' element={<Profile/>}></Route>
    </Routes>

  </BrowserRouter>
}

