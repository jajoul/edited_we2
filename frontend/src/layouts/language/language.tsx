import { Context } from "@/assets/Provider/Provider";
import { useContext } from "react";
import { EN, FA } from "../../assets/Provider/types";

const enFile = require("../../assets/lang/en.json");
const faFile = require("../../assets/lang/fa.json");

export const getFilesBaseOnLanguages = () => {
  const context = useContext(Context);

  const fileLib = {
    [FA]: faFile,
    [EN]: enFile,
  };

  return fileLib[context.state.lng]
};
