import {Routes, Route, Navigate} from "react-router-dom"
import Register from "./pages/Register"
import Chat from "./pages/Chat"
import Login from "./pages/Login"
import "bootstrap/dist/css/bootstrap.min.css"
import {Container} from "react-bootstrap"
import NavbarMain from "./component/Navbar"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import { ToastContainer } from "react-toastify"
import { ChatContextProvider } from "./context/ChatContext"




function App() {
  const {user} = useContext(AuthContext);
  return (
    <ChatContextProvider user = {user}>
      <ToastContainer toastStyle={{ top:40 }} />
        <NavbarMain />
        <Container>
          <Routes>
            <Route path="/" element={user ? <Chat /> : <Login />}/>
            <Route path="/register" element={user ? <Chat /> : <Register />}/>
            <Route path="/login" element={user ? <Chat /> : <Login />}/>
            <Route path="*" element={<Navigate to="/"/>}/>
          </Routes>
        </Container>
    </ChatContextProvider>
  )
}

export default App;
