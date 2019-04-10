<template>
  <nav class="navbar is-white">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item">
          <router-link to="/">
            <h1>Wojna - karciana gra online</h1>
          </router-link>
        </a>
        <span class="navbar-burger burger" data-target="navbarMenuHeroA">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div id="navbarMenuHeroA" class="navbar-menu">
        <div class="navbar-end">
          <a class="navbar-item">
            <router-link to="/">
              Strona główna
            </router-link>
          </a>
          <a class="navbar-item" @click="load">
            Gra
          </a>
          <a class="navbar-item">
            Documentation
          </a>
          <span class="navbar-item">
            <a class="button is-light-ter is-inverted">
                <span class="icon">
                <i class="fab fa-github"></i>
                </span>
                <span>Github</span>
            </a>
          </span>
        </div>
      </div>
    </div>
    <!--<b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>-->
  </nav>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'navbar',
        data() {
            return {
                isLoading: false,
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
                setTimeout(()=>{
                    this.$store.dispatch('gameStart').then(()=>{
                        this.isLoading = false;
                        this.$router.push('game')
                    })
                }, 400);
            }
        },
        created() {
            if(this.gameState.gameStatus)
                this.gameActive = true;
            else
                this.gameActive = false;
        }
    }
</script>

