export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');

export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem('user'));
export const removeUser = () => localStorage.removeItem('user');

export const isAuthenticated = () => !!getToken();
export const getUserRole = () => getUser()?.role; 