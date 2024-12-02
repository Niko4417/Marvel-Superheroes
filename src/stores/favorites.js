import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
    state: () => ({
        favoriteCharacters: [],
        favoriteComics: []
    }),
    actions: {
        addFavoriteCharacter(character) {
            if (!this.favoriteCharacters.find(c => c.id === character.id)) {
                this.favoriteCharacters.push(character)
            }
        },
        removeFavoriteCharacter(characterId) {
            this.favoriteCharacters = this.favoriteCharacters.filter(c => c.id !== characterId)
        },
        addFavoriteComic(comic) {
            if (!this.favoriteComics.find(c => c.id === comic.id)) {
                this.favoriteComics.push(comic)
            }
        },
        removeFavoriteComic(comicId) {
            this.favoriteComics = this.favoriteComics.filter(c => c.id !== comicId)
        }
    }
})
