import React, { useContext } from "react";
import { Navigate } from "umi";
import { Context } from "../Provider/Provider";
import DotLoading from "@/components/DotLoading/DotLoading";

const CheckLogin = (props: { children: JSX.Element, notLoginForShow?:boolean }) => {
  const { children, notLoginForShow } = props;

  const { state } = useContext(Context);
  // return children
  if (state.getUserLoading) return <DotLoading />;
  else if(notLoginForShow && !state.isLogin) return children
  else if(!notLoginForShow && state.isLogin ) return children;
  else if(notLoginForShow) return <Navigate to={"/insight-web"} />;
  else return <Navigate to={"/login"} />;
};

export default CheckLogin;
