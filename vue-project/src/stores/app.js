import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    usuaris: [],
    nom: '',
    peticioRebuda: {
      estat: false,
      socketId: '',
      data: {}
    }
  }),

  actions: {
    getUsuaris() {
      return this.usuaris
    },
    getNom() {
      return this.nom
    },
    getPeticiorebuda() {
      return this.peticioRebuda
    },
    setNom(nom) {
      this.nom = nom
    },
    setUsuaris(usuaris) {
      this.usuaris = usuaris
    },
    setPeticioRebuda(peticioRebuda) {
      this.peticioRebuda = peticioRebuda
    },
  },
})
