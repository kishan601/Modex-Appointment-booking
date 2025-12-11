import { Outlet, useLocation } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Footer from "./components/Footer/Footer";
import DownloadApp from "./components/Sections/DownloadApp/DownloadApp";
import NotificationContainer from "./components/Notifications/NotificationContainer";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div>
      <CssBaseline />
      <NotificationContainer />
      <Outlet />
      {!isAdminRoute && <DownloadApp />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
