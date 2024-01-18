import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    usuaris: [],
    nom: '',
  }),

  actions: {
    getUsuaris() {
      return this.usuaris
    },
    getNom() {
      return this.nom
    },
    setNom(nom) {
      this.nom = nom
    },
    setUsuaris(usuaris) {
      this.usuaris = usuaris
    }
  },
})
