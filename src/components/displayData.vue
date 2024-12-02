<template>
  <h1>Fetching von Daten und Sortierfunktion</h1>
  <v-divider></v-divider>
  <div>
    <v-card
        class="mx-auto"
        max-width="344"

    >
      <v-img
          height="200px"
          src="https://content.imageresizer.com/images/memes/Happy-dolphin-rainbow-meme-8hf4qw.jpg"
          cover
      ></v-img>
      <v-card-title>
        Meine Karte
      </v-card-title>
      <v-card-subtitle>
        Ich liebe die IHK
      </v-card-subtitle>
      <v-card-actions>
        <v-btn
            color="orange-lighten-2"
            text="Add to Favorites"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn
            :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="show = !show"
        ></v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>

          <v-card-text>
            Hier könnte Ihre Werbung stehen!
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script setup>

import {ref} from "vue";

const show = ref(false)
</script>

<style scoped>


</style>