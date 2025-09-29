import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
//import Nav from "./components/Nav";
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from "./router/Routes";
import { Provider } from "./contexts/GlobalContext.jsx";

function App() {
  return (
   <Provider>

    <BrowserRouter >
      <AppRoutes />
    </BrowserRouter>
   </Provider>
  );
}

export default App;
