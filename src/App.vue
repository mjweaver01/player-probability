<template>
  <div class="bg-gray-100 min-h-screen py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-indigo-800 mb-2">Player Probability Forecast</h1>
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
  </div>
</template>

<script>
import PlayerSearch from './components/PlayerSearch.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import PlayerResults from './components/PlayerResults.vue';

export default {
  name: 'App',
  components: {
    PlayerSearch,
    LoadingSpinner,
    PlayerResults
  },
  data() {
    return {
      playerName: '',
      loading: false,
      showResults: false,
      result: {},
      lastUpdated: ''
    };
  },
  methods: {
    async getPlayerProbability(playerName) {
      this.playerName = playerName;
      this.loading = true;
      this.showResults = false;
      
      try {
        const response = await fetch('/.netlify/functions/probability?playerName=' + encodeURIComponent(playerName));
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        this.result = await response.json();
        this.lastUpdated = new Date().toLocaleString();
        this.showResults = true;
        
        // Save to local storage
        this.saveToLocalStorage();
      } catch (error) {
        console.error('Error:', error);
        alert('Error fetching data. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    saveToLocalStorage() {
      const dataToSave = {
        playerName: this.playerName,
        result: this.result,
        showResults: this.showResults,
        lastUpdated: this.lastUpdated
      };
      localStorage.setItem('playerProbabilityData', JSON.stringify(dataToSave));
    },
    loadFromLocalStorage() {
      const savedData = localStorage.getItem('playerProbabilityData');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.playerName = data.playerName || '';
        this.result = data.result || {};
        this.showResults = data.showResults || false;
        this.lastUpdated = data.lastUpdated || '';
      }
    },
    clearData() {
      this.playerName = '';
      this.result = {};
      this.showResults = false;
      this.lastUpdated = '';
      localStorage.removeItem('playerProbabilityData');
    }
  },
  mounted() {
    this.loadFromLocalStorage();
  }
}
</script> 