<script setup>

import router from "../router/index.js";

</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
          color="#3C4151"
          location="left"
          expand-on-hover
          app
          rail
      >
        <v-list>
          <v-list-item
              prepend-avatar="https://img.freepik.com/free-vector/mustache-emoji-illustration_23-2151063111.jpg?ga=GA1.1.1752652611.1725355109&semt=ais_hybrid"
              subtitle=""
              title="Marvel Superheroes"
              style=""
              @click="router.push({ path: '/' })"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-earth" title="Explore"
                         @click="router.push({ path: '/categories' })"></v-list-item>
            <v-list-item prepend-icon="mdi-heart" title="Favorites"
                         @click="router.push({ path: '/favorites' })"></v-list-item>
            <v-list-item prepend-icon="mdi-lightbulb-outline" title="Fun Facts"
                         @click="router.push({ path: '/funfacts' })"></v-list-item>
          </v-list>
      </v-navigation-drawer>

    </v-layout>
  </v-card>
</template>

<style scoped>
v-list-item {
  font-weight: bold;
  font-size: large
}
</style>