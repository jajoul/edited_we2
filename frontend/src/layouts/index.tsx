import Provider from "@/assets/Provider/Provider";
import { ToastContainer } from "react-toastify";
import { Helmet, Outlet } from "umi";
import "./index.less";
import { getFilesBaseOnLanguages } from "./language/language";

import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
  const lang = getFilesBaseOnLanguages();

  return (
    <Provider>
      <Helmet>
        <link rel="icon" href="../../public/logo.ico" />
        <title>WeToo</title>
      </Helmet>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Outlet />
    </Provider>
  );
}
