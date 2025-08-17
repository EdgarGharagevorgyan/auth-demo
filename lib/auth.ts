let _token: string | null = null;

export const getToken = () => _token;
export const setToken = (t: string) => { _token = t; };
export const clearToken = () => { _token = null; };
