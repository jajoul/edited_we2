import { Navigate } from "umi";

function getCookie(name: string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const logout = async () => {
  console.log('log out func');
  const token = localStorage.getItem("WeTooAccessToken");
  const csrftoken = getCookie('csrftoken'); // Get CSRF token

  // If no token exists, just clear local storage and redirect
  if (!token) {
    console.log('No token found in localStorage. Skipping backend logout API call.');
    localStorage.removeItem("WeTooAccessToken");
    window.location.href = '/login';
    return; // Exit the function
  }

  console.log('Token found:', token);
  console.log('CSRF Token found:', csrftoken);

  try {
    const response = await fetch('/api-auth/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`, // Assuming Token-based authentication
        'X-CSRFToken': csrftoken || '', // Include CSRF token
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