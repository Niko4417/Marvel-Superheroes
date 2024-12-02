<template>
  <h1>Marvel Characters</h1>
  <v-divider></v-divider>
  <div v-if="isLoading">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  <div v-else>
    <div v-if="errorMessage">
      <v-alert type="error">{{ errorMessage }}</v-alert>
    </div>
    <v-container fluid>
      <v-row>
        <v-col
            v-for="character in characters"
            :key="character.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
        >
          <v-card class="mx-auto my-4">
            <v-img
                height="200px"
                :src="character.thumbnail.path + '.' + character.thumbnail.extension"
                :alt="character.name"
                cover
            ></v-img>
            <v-card-title>{{ character.name }}</v-card-title>
            <v-card-subtitle>
              {{
                character.description
                    ? character.description.substring(0, 60) + '...'
                    : 'Keine Beschreibung verfügbar.'
              }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                  :color="isFavorited(character.id) ? 'green' : 'orange-lighten-2'"
                  text
                  @click="toggleFavorite(character)"
              >
                {{ isFavorited(character.id) ? 'Favorisiert' : 'Favorisieren' }}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                  :icon="character.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="character.show = !character.show"
              ></v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="character.show">
                <v-divider></v-divider>
                <v-card-text>{{ character.description }}</v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
      <!-- Button to Fetch New Characters -->
      <v-btn @click="fetchCharacters" :disabled="isLoading">
        Neue Charaktere laden
      </v-btn>
    </v-container>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeMount} from 'vue';
import axios from 'axios';
import md5 from 'crypto-js/md5';
import {useFavoritesStore} from '../stores/favorites'; // Adjust the path based on your project structure

const characters = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const favoritesStore = useFavoritesStore();

// Marvel API keys (use environment variables)
const publicKey = import.meta.env.VITE_MARVEL_PUBLIC_KEY;
const privateKey = import.meta.env.VITE_MARVEL_PRIVATE_KEY;

// Function to generate timestamp and hash
const generateAuthParams = () => {
  const ts = Date.now().toString();
  const hash = md5(ts + privateKey + publicKey).toString();
  return {ts, hash};
};

const fetchCharacters = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    characters.value = []; // Empty the array on API call

    const limit = 100; // Fetch 100 characters to increase chances
    const desiredCharactersCount = 8; // Number of characters to display

    // Get the total number of characters available
    const {ts, hash} = generateAuthParams();
    const totalResponse = await axios.get(
        'https://gateway.marvel.com/v1/public/characters',
        {
          params: {
            ts,
            apikey: publicKey,
            hash,
            limit: 1, // Fetching one to get the total
          },
        }
    );

    const totalCharacters = totalResponse.data.data.total;

    // Generate a random offset
    const maxOffset = totalCharacters - limit;
    let offset = Math.floor(Math.random() * maxOffset);

    let totalFetched = 0;
    const characterIds = new Set();

    // Continue fetching until we have 8 unique characters with descriptions
    while (characters.value.length < desiredCharactersCount && totalFetched < totalCharacters) {
      const {ts, hash} = generateAuthParams(); // Generate new auth params for each request
      const response = await axios.get(
          'https://gateway.marvel.com/v1/public/characters',
          {
            params: {
              ts,
              apikey: publicKey,
              hash,
              limit,
              offset,
            },
          }
      );

      const fetchedCharacters = response.data.data.results;

      // Filter characters with descriptions and not already added
      const newCharacters = fetchedCharacters.filter(
          (character) =>
              character.description &&
              character.description.trim() !== '' &&
              !characterIds.has(character.id)
      );

      // Add new characters to the array and update the set of IDs
      newCharacters.forEach((character) => {
        if (characters.value.length < desiredCharactersCount) {
          characters.value.push({
            id: character.id,
            name: character.name,
            description: character.description,
            thumbnail: character.thumbnail,
            show: false,
          });
          characterIds.add(character.id);
        }
      });

      totalFetched += fetchedCharacters.length;
      offset = (offset + limit) % totalCharacters;

      // Break if we've fetched all available characters
      if (totalFetched >= totalCharacters) {
        break;
      }
    }
  } catch (error) {
    console.error('Error fetching characters:', error);
    errorMessage.value = 'Fehler beim Laden der Charaktere.';
  } finally {
    isLoading.value = false;
  }
};

const toggleFavorite = (character) => {
  if (isFavorited(character.id)) {
    favoritesStore.removeFavorite(character.id);
  } else {
    favoritesStore.addFavorite(character);
  }
};

const isFavorited = (characterId) => {
  return favoritesStore.isFavorited(characterId);
};

onBeforeMount(() => {
  fetchCharacters();
});
</script>

<style scoped>
/* Add any additional styling here */
</style>
