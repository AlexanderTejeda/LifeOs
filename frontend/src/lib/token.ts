const KEY = 'lifeos.token'

// JWT lives in localStorage for the MVP. Note: this is readable by any script
// on the page (XSS risk). A hardened setup would move to httpOnly cookies set
// by the backend — tracked as a follow-up before going public.
export const getToken = () => localStorage.getItem(KEY)
export const setToken = (token: string) => localStorage.setItem(KEY, token)
export const clearToken = () => localStorage.removeItem(KEY)
