import { Navigate } from "umi";

export const logout = async () => {
  console.log('log out func');
  const token = localStorage.getItem("WeTooAccessToken");
  try {
    const response = await fetch('/api-auth/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}` // Assuming Token-based authentication
      },
    });

    if (response.ok) {
      console.log('Logged out successfully from backend.');
    } else {
      console.error('Backend logout failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error during backend logout:', error);
  } finally {
    localStorage.removeItem("WeTooAccessToken");
    window.location.href = '/login';
  }
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
