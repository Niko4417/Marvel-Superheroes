<template>
  <h1>Marvel Fun Facts</h1>
  <v-divider></v-divider>


  <div>
    <v-btn @click="fetchFunFact" :disabled="isLoading">
      Neuer Fun Fact
    </v-btn>
  </div>


  <div style="margin-top: 10px" v-if="isLoading">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>


  <div v-else-if="funFact">
    <v-card class="mx-auto my-4">
      <v-card-title>{{ funFact.title }}</v-card-title>
      <v-card-text>{{ funFact.description }}</v-card-text>
    </v-card>
  </div>


  <div v-else-if="errorMessage">
    <v-alert type="error">{{ errorMessage }}</v-alert>
  </div>
</template>
<script setup>
import {ref} from 'vue';
import axios from 'axios';
import md5 from 'crypto-js/md5';

const funFact = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');


const publicKey = import.meta.env.VITE_MARVEL_PUBLIC_KEY;
const privateKey = import.meta.env.VITE_MARVEL_PRIVATE_KEY;


const generateAuthParams = () => {
  const ts = Date.now().toString();
  const hash = md5(ts + privateKey + publicKey).toString();
  return {ts, hash};
};

const fetchFunFact = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    funFact.value = null;


    const endpoints = ['characters', 'comics', 'events', 'series', 'stories'];
    const randomEndpoint =
        endpoints[Math.floor(Math.random() * endpoints.length)];
    const {ts, hash} = generateAuthParams();


    const totalResponse = await axios.get(
        `https://gateway.marvel.com/v1/public/${randomEndpoint}`,
        {
          params: {
            ts,
            apikey: publicKey,
            hash,
            limit: 1,
          },
        }
    );

    const totalItems = totalResponse.data.data.total;

    const offset = Math.floor(Math.random() * totalItems);


    const response = await axios.get(
        `https://gateway.marvel.com/v1/public/${randomEndpoint}`,
        {
          params: {
            ts,
            apikey: publicKey,
            hash,
            limit: 1,
            offset,
          },
        }
    );

    const item = response.data.data.results[0];


    let title = '';
    let description = '';

    switch (randomEndpoint) {
      case 'characters':
        title = `Charakter: ${item.name}`;
        description = item.description || 'Keine Beschreibung verfügbar.';
        break;
      case 'comics':
        title = `Comic: ${item.title}`;
        description = item.description || 'Keine Beschreibung verfügbar.';
        break;
      case 'events':
        title = `Event: ${item.title}`;
        description = item.description || 'Keine Beschreibung verfügbar.';
        break;
      case 'series':
        title = `Serie: ${item.title}`;
        description = item.description || 'Keine Beschreibung verfügbar.';
        break;
      case 'stories':
        title = `Story: ${item.title || 'Ohne Titel'}`;
        description = item.description || 'Keine Beschreibung verfügbar.';
        break;
      default:
        title = 'Unbekannt';
        description = 'Keine Beschreibung verfügbar.';
    }

    funFact.value = {title, description};
  } catch (error) {
    console.error('Error fetching fun fact:', error);
    errorMessage.value = 'Fehler beim Laden des Fun Facts.';
  } finally {
    isLoading.value = false;
  }
};
</script>
<style scoped>

</style>
