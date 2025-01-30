// src/store/useAuthStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  adminRole: null, // Initially no role
  // isAuthenticated: null,
  setAdminRole: (adminRole) => set({ adminRole }), // Set the role after login
  // setIsAuthenticated: (isAuthenticated)=> set({ isAuthenticated }),
}));


export default useAuthStore;