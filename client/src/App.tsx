import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from '@/contexts/AuthProvider'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Regiser from '@/pages/Register'
import { Alert } from '@/utils/SatAlert'
import UsersProvider from './contexts/UsersProvider'
import MessagesProvider from './contexts/MessagesProvider'
import SocketProvider from './contexts/SocketProvider'
import ResponsivenessProvider from './contexts/ResponsivenessProvider'
import PageTitle from './components/PageTitle'

function App() {
  return (
    <BrowserRouter>
      <PageTitle />

      <Alert />
      <Routes>
        <Route element={<SocketProvider />}>
          <Route element={<AuthProvider />}>

            <Route element={<ResponsivenessProvider />}>

              <Route element={<UsersProvider />}>
                <Route element={<MessagesProvider />}>
                  <Route path="/" element={<Home />} />
                </Route>
              </Route>

            </Route>

          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Regiser />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
