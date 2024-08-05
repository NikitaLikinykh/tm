<template>
  <div class="user-profile">
    <div v-if="user" class="user-details card">
      <h1>{{ user.name }}</h1>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
    </div>
    <div class="create-todo card">
      <h2>Create Todo</h2>
      <form @submit.prevent="createTodo">
        <input
          type="number"
          v-model="newTodoUserId"
          placeholder="User ID"
          required
        />
        <input
          type="text"
          v-model="newTodoTitle"
          placeholder="Title"
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
    <div v-if="todos.length" class="todo-list card">
      <h2>Todo List</h2>
      <div class="filters">
        <div class="filter-item">
          <label for="statusFilter">Filter by Status:</label>
          <select v-model="statusFilter" @change="filterTodos">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="uncompleted">Uncompleted</option>
            <option value="favorites">Favorites</option>
          </select>
        </div>
        <div class="filter-item">
          <label for="userFilter">Filter by User ID:</label>
          <select v-model="userFilter" @change="filterTodos">
            <option value="all">All Users</option>
            <option
              v-for="userId in uniqueUserIds"
              :key="userId"
              :value="userId"
            >
              {{ userId }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <input
            type="text"
            v-model="searchQuery"
            @input="filterTodos"
            placeholder="Search by title"
          />
        </div>
      </div>
      <ul class="todo-items">
        <li v-for="todo in filteredTodos" :key="todo.id" class="todo-item">
          <input
            type="checkbox"
            :checked="favorites.includes(todo.id)"
            @change="toggleFavorite(todo.id)"
          />
          <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
        </li>
      </ul>
    </div>

    <div v-if="alertMessage" class="alert">{{ alertMessage }}</div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const user = ref(null);
    const todos = ref([]);
    const statusFilter = ref("all");
    const userFilter = ref("all");
    const searchQuery = ref("");
    const newTodoUserId = ref("");
    const newTodoTitle = ref("");
    const favorites = ref(JSON.parse(localStorage.getItem("favorites")) || []);
    const alertMessage = ref("");
    const route = useRoute();

    const filteredTodos = computed(() => {
      let filtered = todos.value;

      if (statusFilter.value !== "all") {
        filtered = filtered.filter((todo) => {
          if (statusFilter.value === "completed") {
            return todo.completed;
          } else if (statusFilter.value === "uncompleted") {
            return !todo.completed;
          } else if (statusFilter.value === "favorites") {
            return favorites.value.includes(todo.id);
          }
        });
      }

      if (userFilter.value !== "all") {
        filtered = filtered.filter(
          (todo) => todo.userId === Number(userFilter.value)
        );
      }

      if (searchQuery.value) {
        filtered = filtered.filter((todo) =>
          todo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      return filtered;
    });

    const uniqueUserIds = computed(() => {
      return [...new Set(todos.value.map((todo) => todo.userId))];
    });

    const filterTodos = () => {};

    const createTodo = async () => {
      const newTodo = {
        userId: newTodoUserId.value,
        title: newTodoTitle.value,
        completed: false,
      };

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        }
      );

      const addedTodo = await response.json();
      todos.value.push(addedTodo);
      newTodoUserId.value = "";
      newTodoTitle.value = "";
    };

    const toggleFavorite = (todoId) => {
      if (favorites.value.includes(todoId)) {
        favorites.value = favorites.value.filter((id) => id !== todoId);
        showAlert(`Removed from favorites`);
      } else {
        favorites.value.push(todoId);
        showAlert(`Added to favorites`);
      }
    };

    const showAlert = (message) => {
      alertMessage.value = message;
      setTimeout(() => {
        alertMessage.value = "";
      }, 2000);
    };

    onMounted(async () => {
      const userId = route.params.userId;
      const userResponse = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      user.value = await userResponse.json();

      const todosResponse = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      todos.value = await todosResponse.json();
    });

    watch(favorites, (newFavorites) => {
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    });

    return {
      user,
      todos,
      statusFilter,
      userFilter,
      searchQuery,
      newTodoUserId,
      newTodoTitle,
      favorites,
      filteredTodos,
      uniqueUserIds,
      filterTodos,
      createTodo,
      toggleFavorite,
      alertMessage,
    };
  },
};
</script>
