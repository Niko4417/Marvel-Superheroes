<template>
  <h1>Marvel Characters</h1>
  <v-divider></v-divider>


  <div>
    <v-btn @click="fetchCharacters">
      {{ 'Charaktere laden' }}
    </v-btn>
  </div>


  <div style="margin-top: 10px " v-if="isLoading">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>


  <div v-else-if="characters.length > 0">
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
    </v-container>
  </div>


  <div v-else-if="errorMessage">
    <v-alert type="error">{{ errorMessage }}</v-alert>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import axios from 'axios';
import md5 from 'crypto-js/md5';
import {useFavoritesStore} from '../stores/favorites';

const characters = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const favoritesStore = useFavoritesStore();


const publicKey = import.meta.env.VITE_MARVEL_PUBLIC_KEY;
const privateKey = import.meta.env.VITE_MARVEL_PRIVATE_KEY;


const generateAuthParams = () => {
  const ts = Date.now().toString();
  const hash = md5(ts + privateKey + publicKey).toString();
  return {ts, hash};
};

const fetchCharacters = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    characters.value = [];

    const limit = 100;
    const desiredCharactersCount = 8;

    const {ts, hash} = generateAuthParams();
    const totalResponse = await axios.get(
        'https://gateway.marvel.com/v1/public/characters',
        {
          params: {
            ts,
            apikey: publicKey,
            hash,
            limit: 1,
          },
        }
    );

    const totalCharacters = totalResponse.data.data.total;

    const maxOffset = totalCharacters - limit;
    let offset = Math.floor(Math.random() * maxOffset);

    let totalFetched = 0;
    const characterIds = new Set();


    while (characters.value.length < desiredCharactersCount && totalFetched < totalCharacters) {
      const {ts, hash} = generateAuthParams();
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


      const newCharacters = fetchedCharacters.filter(
          (character) =>
              character.description &&
              character.description.trim() !== '' &&
              !characterIds.has(character.id)
      );


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

</script>

<style scoped>

</style>
