<template>
  <nav class="navbar is-white">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item">
          <router-link to="/">
            <h1>Wojna - karciana gra online</h1>
          </router-link>
        </a>
        <span class="navbar-burger burger" v-bind:class="{ 'is-active': isActive }" data-target="navbarMenuHeroA" @click="showNavbar">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div id="navbarMenuHeroA" class="navbar-menu" v-bind:class="{ 'is-active': isActive }">
        <div class="navbar-end">
          <router-link to="/" class="navbar-item">
            <a>
              Strona główna
            </a>
          </router-link>
          <a class="navbar-item" @click="load">
            Graj
          </a>
          <a class="navbar-item" @click="how2play">
            Jak grać?
          </a>
          <span class="navbar-item">
            <a href="https://github.com/HubertLipinski/VueWar" target="_blank" class="button is-light-ter is-inverted">
                <span class="icon">
                <i class="fab fa-github"></i>
                </span>
                <span>Github</span>
            </a>
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import { Dialog } from 'buefy/dist/components/dialog'
    export default {
        name: 'navbar',
        data() {
            return {
                isLoading: false,
                isActive: false,
                gameActive: false,
            }
        },
        computed: mapGetters(['gameState','players', 'deck', 'playerHand']),
        methods: {
            ...mapActions(['gameStart']),
            load(){
                if (this.gameActive) {
                    this.$router.push('game');
                    return;
                }
                this.isLoading = true;
                setTimeout(() => {
                    this.$store.dispatch('gameStart').then(() => {
                        this.isLoading = false;
                        this.$router.push('game')
                    })
                }, 400);
            },
            showNavbar() {
                this.isActive === false ? this.isActive=true : this.isActive=false;
            },
          how2play() {
            Dialog.alert({
              title: 'Jak grać?',
              message: 'Nie ma nic prostszego! <br> Poprostu wyjmujesz karty z talii <b>klikając w swój stos kart </b>(na dole)',
              confirmText: 'Rozumiem',
              type: 'is-success'
            })
          },
        },
        created() {
            this.gameActive = !!this.gameState.gameStatus;
        }
    }
</script>

