// src/stores/favorites.js
import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', {
    state: () => ({
        favorites: [],
    }),
    actions: {
        addFavorite(character) {
            if (!this.favorites.find((fav) => fav.id === character.id)) {
                this.favorites.push(character);
            }
        },
        removeFavorite(characterId) {
            this.favorites = this.favorites.filter((fav) => fav.id !== characterId);
        },
        isFavorited(characterId) {
            return this.favorites.some((fav) => fav.id === characterId);
        },
    },
});
