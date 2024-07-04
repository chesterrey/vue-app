import { reactive, toRefs } from "vue";
import AuthService from "../service/AuthService";

const state = reactive({
  isAuthenticated: false,
  user: null,
  accessToken: null,
});

export default function useAuthStore() {
  const login = async (loginForm) => {
    const response = await AuthService.login(loginForm);
    if (response.success) {
      state.isAuthenticated = true;
      state.user = response.data.name;
      state.accessToken = response.data.token;

      localStorage.setItem("user", state.user);
      localStorage.setItem("accessToken", state.accessToken);
    }
    return response;
  };

  const register = async (registerForm) => {
    const response = await AuthService.register(registerForm);
    if (response.success) {
      state.isAuthenticated = true;
      state.user = response.data.name;
      state.accessToken = response.data.token;

      localStorage.setItem("user", state.user);
      localStorage.setItem("accessToken", state.accessToken);
    }
    return response;
  };

  const validateSession = () => {
    const user = localStorage.getItem("user") || null;
    const accessToken = localStorage.getItem("accessToken") || null;
    if (user && accessToken) {
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
    }
  };

  const destroySession = () => {
    state.isAuthenticated = false;
    state.user = null;
    state.accessToken = null;
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return {
    ...toRefs(state),
    register,
    login,
    validateSession,
    destroySession,
  };
}
