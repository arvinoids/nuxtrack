export const useAuth = ()=> 
useState(() => ({ 
    isAuthenticated: false,
    role: null
 }))