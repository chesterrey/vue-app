const API_URL = "http://localhost:8000/api";

class ExerciseService {
  async addExercise(form) {
    console.log(form);
    try {
      const response = await fetch(`${API_URL}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
  async editExercise(form) {
    try {
      const response = await fetch(`${API_URL}/exercises/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

  async deleteExercise(id) {
    console.log(id);
    try {
      const response = await fetch(`${API_URL}/exercises/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
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

  async addExerciseSet(id) {
    try {
      const response = await fetch(`${API_URL}/exercise-sets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          exercise_id: id,
        }),
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
  async deleteExerciseSet(id) {
    try {
      const response = await fetch(`${API_URL}/exercise-sets/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
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

  async updateExerciseSet(form) {
    try {
      const response = await fetch(`${API_URL}/exercise-sets/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

export default new ExerciseService();
