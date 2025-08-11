import { Navigate } from "umi";

export const logout = () => {
  console.log('log out func')
  localStorage.removeItem("WeTooAccessToken");
  window.location.href = '/login'
};

export const downloadObject = (url:string, name:string) => {
//   const jsonStr = JSON.stringify(graphData);
  const filename = `${name}.mp4`;
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    url
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
