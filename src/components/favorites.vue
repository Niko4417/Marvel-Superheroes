<!-- Favorites.vue -->
<template>
  <h1>Favorisierte Charaktere</h1>
  <v-divider></v-divider>
  <div v-if="favorites.length === 0">
    <p>Sie haben noch keine Charaktere favorisiert.</p>
  </div>
  <div v-else>
    <v-container fluid>
      <v-row>
        <v-col
            v-for="character in favorites"
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
                  color="red"
                  text
                  @click="removeFromFavorites(character.id)"
              >
                Entfernen
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
</template>

<script setup>
import { computed } from 'vue';
import { useFavoritesStore } from "../stores/favorites.js";

const favoritesStore = useFavoritesStore();
const favorites = computed(() => favoritesStore.favorites);

const removeFromFavorites = (characterId) => {
  favoritesStore.removeFavorite(characterId);
};
</script>

<style scoped>
/* Add any additional styling here */
</style>
