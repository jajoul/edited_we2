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
  console.log('logout function called');
  const token = localStorage.getItem("WeTooAccessToken");
  const csrftoken = getCookie('csrftoken');

  try {
    if (token) {
      // First, try to logout from the backend
      const logoutResponse = await fetch('https://social.me2we2.com/api/token/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(token).access}`,
          'X-CSRFToken': csrftoken || '',
        },
        credentials: 'include', // Include cookies
      });

      if (logoutResponse.ok) {
        console.log('Successfully logged out from backend');
      } else {
        console.error('Backend logout failed:', logoutResponse.status);
      }
    }
  } catch (error) {
    console.error('Logout request failed:', error);
  }

  // Cleanup all storage and session data
  try {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Prevent navigation back to authenticated pages
    window.history.pushState(null, '', '/login');
    window.addEventListener('popstate', () => {
      window.history.pushState(null, '', '/login');
    });

    // Force redirect to login page
    window.location.replace('/login');
  } catch (e) {
    console.error('Error during cleanup:', e);
    // If all else fails, try a simple redirect
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