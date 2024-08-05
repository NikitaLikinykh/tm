<template>
  <div class="login-form">
    <div class="login-form__header">description</div>
    <form @submit.prevent="login" class="login-form__wrapper">
      <div class="form-group">
        <span class="username-label">description</span>
        <input
          v-model="username"
          type="text"
          @input="validateUsername"
          placeholder="Username"
          required
        />
        <div v-if="usernameError" class="error">{{ usernameError }}</div>
      </div>
      <div class="form-group">
        <input
          type="text"
          v-model="phone"
          @input="validatePhone"
          placeholder="Phone Number"
          required
        />
        <div v-if="phoneError" class="error">{{ phoneError }}</div>
      </div>
      <button type="submit" class="btn-register">Register</button>
    </form>
    <div v-if="error" class="login-error">{{ error }}</div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const username = ref("");
    const phone = ref("");
    const error = ref(null);
    const usernameError = ref(null);
    const phoneError = ref(null);
    const router = useRouter();

    const validateUsername = () => {
      if (!/^[a-zA-Zа-яА-ЯёЁ]*$/.test(username.value)) {
        usernameError.value = "Username must contain only letters.";
        username.value = username.value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, "");
      } else {
        usernameError.value = null;
      }
    };

    const validatePhone = () => {
      if (!/^[0-9-+()]*$/.test(phone.value)) {
        phoneError.value = "Phone number must contain only numbers and symbols";
        phone.value = phone.value.replace(/[^0-9-+()]/g, "");
      } else {
        phoneError.value = null;
      }
    };

    const normalizePhone = (phone) => {
      return phone.replace(/[^\d]/g, "");
    };

    const login = async () => {
      validateUsername();
      validatePhone();

      if (usernameError.value || phoneError.value) {
        error.value = "Please fix the validation errors.";
        return;
      }

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const users = await response.json();
        const normalizedInputPhone = normalizePhone(phone.value);
        const user = users.find((user) => {
          const normalizedUserPhone = normalizePhone(user.phone.split(" ")[0]);
          return (
            user.username === username.value &&
            normalizedUserPhone === normalizedInputPhone
          );
        });
        if (user) {
          router.push({ name: "UserProfile", params: { userId: user.id } });
        } else {
          error.value = "Login error";
        }
      } catch (err) {
        console.error(err);
        error.value = "An error occurred";
      }
    };

    return {
      username,
      phone,
      error,
      usernameError,
      phoneError,
      validateUsername,
      validatePhone,
      login,
    };
  },
};
</script>
