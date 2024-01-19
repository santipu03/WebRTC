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
    },
    respostaRebuda: {
      estat: false,
      socketId: '',
      data: {}
    },
    pagina: 'home',
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
    getRespostaRebuda() {
      return this.respostaRebuda
    },
    getPagina() {
      return this.pagina
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
    setPagina(pagina) {
      this.pagina = pagina
    },
    setRespostaRebuda(respostaRebuda) {
      this.respostaRebuda = respostaRebuda
    },
  },
})
