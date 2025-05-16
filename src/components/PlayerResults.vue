<template>
  <div class="transition-all duration-300">
    <div class="bg-white rounded-xl overflow-hidden shadow-lg">
      <div class="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
        <h2 class="text-2xl font-bold">{{ result.player || playerName }}</h2>
        <p class="opacity-90" v-if="result.nextGame">
          <span v-html="parsedNextGame"></span>
        </p>
      </div>
      
      <div class="flex flex-col md:flex-row">
        <div class="w-full md:w-1/3 p-6 flex items-center justify-center bg-gray-50">
          <img 
            :src="result.image"
            class="max-w-full h-auto rounded-md shadow-md" 
            :alt="result.player || playerName"
          >
        </div>
        
        <div class="w-full md:w-2/3 p-6">
          <div class="mb-6">
            <div class="flex justify-between items-center mb-1">
              <h3 class="text-gray-700 font-medium">Probability</h3>
              <span class="text-indigo-600 font-bold">{{ formattedProbability }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                class="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                :style="`width: ${typeof result.probability === 'number' ? result.probability * 100 : 0}%`"
              ></div>
            </div>
          </div>
          
          <div class="mb-6">
            <div class="flex justify-between items-center mb-1">
              <h3 class="text-gray-700 font-medium">Confidence</h3>
              <span class="text-blue-600 font-bold">{{ formattedConfidence }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                class="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                :style="`width: ${typeof result.confidence === 'number' ? result.confidence * 100 : 0}%`"
              ></div>
            </div>
          </div>
          
          <div class="mt-4">
            <h3 class="text-gray-700 font-medium mb-2">Analysis</h3>
            <div class="text-gray-600 markdown-content" v-html="parsedExplanation"></div>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-50 p-4 border-t border-gray-200 flex justify-between">
        <button 
          @click="$emit('clear')" 
          class="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Clear Data
        </button>
        <span class="text-xs text-gray-500">Last updated: {{ lastUpdated }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';

export default {
  name: 'PlayerResults',
  props: {
    result: {
      type: Object,
      required: true
    },
    playerName: {
      type: String,
      default: ''
    },
    lastUpdated: {
      type: String,
      default: ''
    }
  },
  computed: {
    formattedProbability() {
      return typeof this.result.probability === 'number' 
        ? `${(this.result.probability * 100).toFixed(1)}%` 
        : 'Unknown';
    },
    formattedConfidence() {
      return typeof this.result.confidence === 'number' 
        ? `${(this.result.confidence * 100).toFixed(1)}%` 
        : 'Unknown';
    },
    parsedExplanation() {
      return this.result.explanation ? marked.parse(this.result.explanation) : 'No explanation available';
    },
    parsedNextGame() {
      return this.result.nextGame ? marked.parse(this.result.nextGame) : 'Unknown';
    }
  }
}
</script> 