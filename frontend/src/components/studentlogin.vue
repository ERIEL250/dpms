<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeftIcon } from "@heroicons/vue/24/solid";

const email = ref("");
const password = ref("");
const errorMessage = ref(""); 
const router = useRouter(); 

const login = async () => {
  errorMessage.value = ""; 
  try {
    const response = await fetch("http://localhost:8000/api/Users/studentLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
      credentials: "include", // Ensures cookies (if used) are stored
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    console.log("Login successful:", data);
    router.push("/studentdashboard"); // Redirect user to dashboard after login
  } catch (error) {
    errorMessage.value = error.message; // Show error message in UI
  }
};
</script>
<template>
  <div class="flex items-center justify-center min-h-screen bg-cover bg-center " 
       style="background-image: url('https://pfst.cf2.poecdn.net/base/image/0935f79852dea24c2fd6768a80c491e649f17294fd8005edbbef6672a8a536ee?w=1024&h=768&pmaid=289842107');">
    <div class="bg-white p-8 rounded-lg shadow-2xl shadow-gray-600 w-96 border border-gray-100">
      <RouterLink to="/" class=""><ArrowLeftIcon class="w-6 h-6 text-gray-700" /></RouterLink>

      <h2 class="text-2xl font-semibold text-center mb-6">Student Log in</h2>

      <!-- Error Message Display -->
      <p v-if="errorMessage" class="text-red-500 text-sm text-center mb-4">{{ errorMessage }}</p>

      <form @submit.prevent="login" class="space-y-4 ">
        <input 
          type="email" 
          v-model="email" 
          placeholder="Email" 
          class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
          required
        />
        <input 
          type="password" 
          v-model="password" 
          placeholder="Password" 
          class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" 
          required
        />
        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
          Log in
        </button>
        <div class="text-center">
          <a href="#" class="text-blue-600 text-sm hover:underline">Forgot your password?</a>
        </div>
        <div class="text-center">
          <!-- <RouterLink to="/studentregister" class="text-blue-600 text-sm hover:underline">
            New? Create your account here!
          </RouterLink> -->
        </div>
      </form>
    </div>
  </div>
</template>
