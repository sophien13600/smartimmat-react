import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
//import Nav from "./components/Nav";
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from "./router/Routes";
import { GlobalContext } from "./contexts/GlobalContext.jsx";

function App() {
  return (
   <GlobalContext value = {false}>

    <BrowserRouter >
      <AppRoutes />
    </BrowserRouter>
   </GlobalContext>
  );
}

export default App;
