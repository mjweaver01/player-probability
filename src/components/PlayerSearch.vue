<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <div class="flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        v-model="playerName"
        placeholder="Enter player name (e.g., LeBron James)"
        @keyup.enter="searchPlayer"
        class="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        :disabled="loading"
      />
      <button
        @click="searchPlayer"
        class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
        :disabled="loading"
      >
        <span v-if="!loading">Get Probability</span>
        <span v-else>Loading...</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PlayerSearch',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const playerName = ref('');

    const searchPlayer = () => {
      if (!playerName.value.trim()) {
        alert('Please enter a player name');
        return;
      }
      emit('search', playerName.value.trim());
    };

    return {
      playerName,
      searchPlayer,
    };
  },
});
</script>
