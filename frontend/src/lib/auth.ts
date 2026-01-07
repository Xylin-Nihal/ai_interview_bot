// Auth utilities
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("resume_id");
    localStorage.removeItem("session_id");
  }
};

export const setResumeId = (resumeId: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("resume_id", String(resumeId));
  }
};

export const getResumeId = () => {
  if (typeof window !== "undefined") {
    const id = localStorage.getItem("resume_id");
    return id ? Number(id) : null;
  }
  return null;
};

export const setSessionId = (sessionId: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("session_id", String(sessionId));
  }
};

export const getSessionId = () => {
  if (typeof window !== "undefined") {
    const id = localStorage.getItem("session_id");
    return id ? Number(id) : null;
  }
  return null;
};

export const isAuthenticated = () => {
  return !!getToken();
};
