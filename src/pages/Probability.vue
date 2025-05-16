<template>
  <div>
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-indigo-800 mb-2">Player Probability</h1>
      <p class="text-gray-600">Predict player performance for upcoming games</p>
    </div>
    
    <PlayerSearch 
      :loading="loading" 
      @search="getPlayerProbability" 
    />
    
    <LoadingSpinner v-if="loading" />
    
    <PlayerResults 
      v-if="showResults" 
      :result="result" 
      :player-name="playerName" 
      :last-updated="lastUpdated"
      @clear="clearData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import PlayerSearch from '../components/PlayerSearch.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import PlayerResults from '../components/PlayerResults.vue';
import { PlayerResult, SavedData } from '../types';

export default defineComponent({
  name: 'Probability',
  components: {
    PlayerSearch,
    LoadingSpinner,
    PlayerResults
  },
  setup() {
    const playerName: Ref<string> = ref('');
    const loading: Ref<boolean> = ref(false);
    const showResults: Ref<boolean> = ref(false);
    const result: Ref<PlayerResult> = ref({});
    const lastUpdated: Ref<string> = ref('');

    const getPlayerProbability = async (name: string): Promise<void> => {
      playerName.value = name;
      loading.value = true;
      showResults.value = false;
      
      try {
        const response = await fetch('/.netlify/functions/probability?playerName=' + encodeURIComponent(name));
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        result.value = await response.json();
        lastUpdated.value = new Date().toLocaleString();
        showResults.value = true;
        
        // Save to local storage - Both current search and history
        saveToLocalStorage();
        saveToHistory();
      } catch (error) {
        console.error('Error:', error);
        alert('Error fetching data. Please try again.');
      } finally {
        loading.value = false;
      }
    };

    const saveToLocalStorage = (): void => {
      const dataToSave: SavedData = {
        playerName: playerName.value,
        result: result.value,
        showResults: showResults.value,
        lastUpdated: lastUpdated.value
      };
      localStorage.setItem('playerProbabilityData', JSON.stringify(dataToSave));
    };

    const saveToHistory = (): void => {
      // Get existing history or initialize empty array
      const historyData = JSON.parse(localStorage.getItem('playerProbabilityHistory') || '[]');
      
      // Add current search to history
      historyData.push({
        id: Date.now(),
        playerName: playerName.value,
        result: result.value,
        timestamp: lastUpdated.value
      });
      
      // Store in localStorage (keep the last 10 searches)
      localStorage.setItem('playerProbabilityHistory', JSON.stringify(
        historyData.slice(-10)
      ));
    };

    const loadFromLocalStorage = (): void => {
      const savedData = localStorage.getItem('playerProbabilityData');
      if (savedData) {
        const data: SavedData = JSON.parse(savedData);
        playerName.value = data.playerName || '';
        result.value = data.result || {};
        showResults.value = data.showResults || false;
        lastUpdated.value = data.lastUpdated || '';
      }
    };

    const clearData = (): void => {
      playerName.value = '';
      result.value = {};
      showResults.value = false;
      lastUpdated.value = '';
      localStorage.removeItem('playerProbabilityData');
    };

    // Load saved data when component is mounted
    loadFromLocalStorage();

    return {
      playerName,
      loading,
      showResults,
      result,
      lastUpdated,
      getPlayerProbability,
      clearData
    };
  }
});
</script> 