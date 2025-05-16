<template>
  <header class="bg-indigo-800 text-white shadow-md">
    <div class="mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <router-link to="/" class="font-bold text-xl">Will They Appear?</router-link>

        <nav class="flex space-x-4">
          <router-link
            to="/"
            class="px-3 py-2 rounded hover:bg-indigo-700 transition-colors"
            :class="{ 'bg-indigo-700': $route.path === '/' }"
          >
            Probability
          </router-link>
          <router-link
            to="/history"
            class="px-3 py-2 rounded hover:bg-indigo-700 transition-colors"
            :class="{ 'bg-indigo-700': $route.path === '/history' }"
          >
            History
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppHeader',
});
</script>
