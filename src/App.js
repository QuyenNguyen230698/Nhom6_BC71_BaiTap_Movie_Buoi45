import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import Layout from './pages/template/Layout';
import DetailPage from './pages/DetailPage/DetailPage';
import BookingPage from './pages/BookingPage/BookingPage';
import AdminListUser from './pages/AdminListUser/AdminListUser';
import 'flowbite';
import Spinner from './components/Spinner';
import UserPage from './pages/UserPage/UserPage';
import './i18n';

function App() {
  return (
    <div>
      <Spinner/>
      <BrowserRouter>
    <Routes>
      {/* admin route */}
      <Route path='list-user' element={<Layout content={<AdminListUser/>}/>}/>
      <Route path='user' element={<Layout content={<UserPage/>}/>}/>
      {/* user route */}
      <Route path='/' element={<Layout content={<HomePage/>}/>}/>
      <Route path='/detail/:id' element={<Layout content={<DetailPage/>}/>}/>
      <Route path='/booking/:id' element={<Layout content={<BookingPage/>}/>}/>
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
