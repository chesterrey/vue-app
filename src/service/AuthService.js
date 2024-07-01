const API_URL = `https://api.strength-training.xyz/api/auth`;
console.log(API_URL);
console.log(`${import.meta.env.VITE_API_BASE_URL}/api`);

class AuthService {
  async login(form) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }).then((response) => {
        return response.json();
      });

      return response;
    } catch (e) {
      return {
        message: e.response.data.message,
        code: e.response.status,
        success: false,
        data: null,
      };
    }
  }

  async register(form) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }).then((response) => {
        return response.json();
      });
      return response;
    } catch (e) {
      return {
        message: e.response.data.message,
        code: e.response.status,
        success: false,
        data: null,
      };
    }
  }
}

export default new AuthService();
