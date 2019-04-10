import Vue from 'vue'
import Vuex from 'vuex'

//modules
import game from './modules/game'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    game,
  }
})
