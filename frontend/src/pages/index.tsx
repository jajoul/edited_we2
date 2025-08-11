import CheckLogin from "@/assets/Hooks/CheckLogin";
import Home from "@/layouts/Home/Home";
import React from "react";

export default function HomePage() {
  return (
    <CheckLogin notLoginForShow={true}>
      <Home />
    </CheckLogin>
  );
}
