import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Portfolio from "./components/portfolio/Portfolio";
import SpinnerFullPage from "./components/divers/SpinnerFullPage";
import { useAppContext } from "./contexts/AppContext";
import ToastContainer from "./components/toast/ToastContainer";
import { useDebugContext } from "./contexts/DebugContext";
import RotationMessage from "./components/divers/RotationMessage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Home from "./pages/Home";
import InLine from "./pages/InLine";
import AdminPage from "./pages/AdminPage";
import PrivateRoute from "./components/system/PrivateRoute";
import Login from "./pages/Login";

const App = () => {
  const { debug } = useDebugContext();
  const {
    isReady,
    confirmService: { ConfirmModalComponent },
  } = useAppContext();

  return (
    <BrowserRouter>
      <div className={"portfolio-container"}>
        {ConfirmModalComponent}
        <ToastContainer />
        <RotationMessage />
        {!isReady ? (
          <SpinnerFullPage />
        ) : (
          <Routes>
            <Route path="/" element={<InLine />}>
              <Route index element={<Navigate replace to="home" />} />
              <Route path={"home"} element={<Home />} />
              <Route path={"aboutUs"} element={<AboutUs />} />
              <Route path={"contactUs"} element={<ContactUs />} />
              <Route path={"login"} element={<Login />} />
              <Route
                path={"admin"}
                element={
                  <PrivateRoute role="admin" loginPath={"/login"}>
                    <AdminPage />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route path="/portfolio/:userId/:lg?/:itemId?" element={<Portfolio key={window.location.pathname} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
