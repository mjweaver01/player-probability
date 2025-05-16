<template>
  <div>
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-indigo-800 mb-2">Search History</h1>
      <p class="text-gray-600">Your previous player forecasts</p>
    </div>
    
    <div v-if="history.length === 0" class="bg-white rounded-lg shadow-md p-10 text-center">
      <p class="text-gray-600 mb-4">You haven't searched for any players yet.</p>
      <router-link to="/" class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors inline-block">
        Go to Probability
      </router-link>
    </div>
    
    <div v-else>
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-semibold text-gray-800">Recent Searches</h2>
        <button 
          @click="clearHistory" 
          class="px-4 py-2 text-red-600 hover:text-red-800 text-sm transition-colors"
        >
          Clear All History
        </button>
      </div>
      
      <div class="space-y-4">
        <div 
          v-for="item in history" 
          :key="item.id" 
          class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex justify-between">
            <div>
              <h3 class="text-lg font-medium text-indigo-700">{{ item.result.player || item.playerName }}</h3>
              <p v-html="parsedNextGame(item.result.nextGame)"></p>
              <div class="text-sm text-gray-500">Searched on {{ item.timestamp }}</div>
            </div>
            <div class="flex items-center">
              <div v-if="item.result.probability" class="mr-5">
                <div class="text-sm text-gray-600">Probability</div>
                <div class="font-semibold">{{ formatPercent(item.result.probability) }}</div>
              </div>
              <div v-if="item.result.confidence">
                <div class="text-sm text-gray-600">Confidence</div>
                <div class="font-semibold">{{ formatPercent(item.result.confidence) }}</div>
              </div>
            </div>
          </div>
          
          <div class="mt-3 pt-3 border-t border-gray-100 flex justify-between">
            <router-link 
              :to="{ name: 'Probability' }"
              @click="reloadSearch(item)"
              class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View Details
            </router-link>
            <button
              @click="deleteItem(item.id)"
              class="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue';
import { marked } from 'marked';
import { HistoryItem, SavedData } from '../types';

export default defineComponent({
  name: 'History',
  setup() {
    const history: Ref<HistoryItem[]> = ref([]);

    const loadHistory = (): void => {
      const historyData = JSON.parse(localStorage.getItem('playerProbabilityHistory') || '[]');
      // Reverse to show newest first
      history.value = historyData.reverse();
    };

    const clearHistory = (): void => {
      if (confirm('Are you sure you want to clear all search history?')) {
        localStorage.removeItem('playerProbabilityHistory');
        history.value = [];
      }
    };

    const deleteItem = (id: string): void => {
      // Filter out the item with the matching id
      history.value = history.value.filter(item => item.id !== id);
      
      // Update localStorage with the new history
      localStorage.setItem('playerProbabilityHistory', JSON.stringify([...history.value].reverse()));
    };

    const formatPercent = (value: number | undefined): string => {
      return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : 'Unknown';
    };

    const parsedNextGame = (nextGame: string): string => {
      return nextGame ? marked.parse(nextGame) : 'Unknown';
    };

    const reloadSearch = (item: HistoryItem): void => {
      // Save the selected item to localStorage so Probability page can load it
      const dataToSave: SavedData = {
        playerName: item.playerName,
        result: item.result,
        showResults: true,
        lastUpdated: item.timestamp
      };
      localStorage.setItem('playerProbabilityData', JSON.stringify(dataToSave));
    };

    onMounted(() => {
      loadHistory();
    });

    return {
      history,
      clearHistory,
      deleteItem,
      formatPercent,
      reloadSearch,
      parsedNextGame
    };
  }
});
</script> 