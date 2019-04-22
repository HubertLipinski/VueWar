<template>
    <div>
        <section class="hero is-white is-fullheight">
            <div class="hero-head">
                <navbar-component/>
            </div>
            <div class="hero-body">
                <div class="container has-text-centered">
                    <h1 class="title">
                        Wojna - karciana gra online
                    </h1>
                    <h2 class="subtitle" >
                        <span v-if="!gameState.gameStatus">
                            Zmierz się ze swoim wrogiem
                        </span>
                        <span v-else>
                            Już uciekasz?
                        </span>
                    </h2>
                    <a class="button is-light is-inverted is-outlined is-large" @click="load">
                        <span v-if="!gameState.gameStatus">Graj</span>
                        <span v-else>Kontynuuj grę</span>
                    </a>
                </div>
            </div>
            <div class="hero-foot">
                <footer-component/>
            </div>
            <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
        </section>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'home',
    data() {
      return {
          isLoading: false,
      }
    },
    methods: {
        ...mapActions(['gameStart']),
        load(){
            if(this.gameState.gameStatus) {
                this.$router.push('game');
                return;
            }
            this.isLoading = true;
            setTimeout(()=>{
                this.$store.dispatch('gameStart').then(()=>{
                    this.isLoading = false;
                    this.$router.push('game')
                })
            }, 400);
        }
    },
    computed: mapGetters(['gameState']),
}

</script>

<style scoped>
    .hero.is-white {
        background-image: linear-gradient(140deg, #e2ffeb -50%, whitesmoke 71%, #b1c0cb 100%)
    }
</style>
