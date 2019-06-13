<template>
    <section class="hero is-white is-fullheight">
        <div class="hero-head">
            <navbar-component/>
        </div>
        <div class="hero-body">
            <div class="game-info">
                <b-tag type="is-dark" size="is-large">Runda: {{(gameState.round+1).toString()}}</b-tag>
            </div>
            <div class="opponent">
                <div class="opponent-card-pile">
                    <b-tooltip type="is-light" position="is-right" :label="'Liczba kart: ' + playerHandLength(1).toString()">
                        <img :src="require('../assets/card-reverse.jpg')"  alt="" class="card-img">
                    </b-tooltip>
                </div>
            </div>
            <hr class="line"/>
            <div class="player">
                <div class="player-card-pile">
                    <b-tooltip type="is-light" position="is-left" :label="'Liczba kart: ' + playerHandLength(0).toString()">
                        <img :src="require('../assets/card-reverse.jpg')"  alt="" class="card-img" @click="makeMove">
                    </b-tooltip>

                </div>
            </div>
            <div class="card-container is-overlay">
                <div v-if="cardPile">
                    <img :src="cardPile[1].card.image" class="card-img" alt="game-card">
                    <img :src="cardPile[0].card.image" class="card-img" alt="game-card">
                </div>
                <!--<img :src="card.card.image" v-for="(card, index) in cardPile" :key="index" class="card-img">-->
                <img v-if="isWar" :src="require('../assets/card-reverse.jpg')"  alt="" class="card-img" style="position: relative; left: -7px; top: 0; transform: scale(0.97)">
                <img v-if="isWar" :src="require('../assets/card-reverse.jpg')"  alt="" class="card-img" style="position: relative; right: 10px; top: 0; transform: scale(0.97)">
            </div>
        </div>
        <div class="hero-foot">
            <footer-component/>
        </div>
        <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
    </section>
</template>

<script>
    import { Toast } from 'buefy/dist/components/toast'
    import { Snackbar } from 'buefy/dist/components/snackbar'
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'game',
        data() {
          return {
              timeout: 1000,
              verdictTime: 500,
              isLoading: true,
              cardPile: null,
              isWar: false,
              userCanMove: true,
          }
        },
        methods: {
            ...mapActions(['gameStart', 'fetchDeck', 'fetchHand', 'throwCard', 'incrementRound', 'takeCards', 'setGameOver']),
            makeMove() {
                if (this.$store.getters.gameOver) {
                    let msg = this.$store.getters.winner;
                    Snackbar.open({
                        message: 'Koniec gry '+msg,
                        type: 'is-warning',
                        position: 'is-top',
                        actionText: 'Nowa gra',
                        indefinite: false,
                        onAction: () => {
                            this.isLoading = true;
                            this.$store.dispatch('gameStart').then(()=>{
                                this.cardPile = null;
                                setTimeout(() => {this.isLoading = false}, 500);
                            })

                        }});
                }
                else if (this.userCanMove) {
                    //round has started
                    this.incrementRound();
                    this.throwCard(1);
                    this.throwCard(0);

                    this.cardPile = this.pile;

                    this.userCanMove = false;
                    setTimeout(()=>this.handleWinner(), this.verdictTime);
                }
                this.checkState();
            },
            handleWinner() {
                this.isWar = false;
                for (let i=0; i<2; i++) {
                    let playerCard = this.cardPile[i].card;
                    switch(playerCard.value){
                        case 'KING': playerCard.value = 13; break;
                        case 'QUEEN': playerCard.value = 12; break;
                        case 'JACK': playerCard.value = 11; break;
                        case 'ACE': playerCard.value = 14; break;
                        default: continue;
                    }
                    // console.log("player",i," card: ", playerCard.value);
                }

                let card1 = parseInt(this.cardPile[0].card.value);
                let card2 = parseInt(this.cardPile[1].card.value);

                if (card1 === card2) {
                    Toast.open({
                        duration: (this.timeout * 1.75),
                        message: `-- Wojna --`,
                        position: 'is-top',
                        type: 'is-warning'
                    })
                    this.isWar = true;
                    this.userCanMove = true;
                }else if (card1 > card2) {
                    this.takeCards(0);
                    Toast.open({
                        duration: this.timeout,
                        message: `Wygrałeś!`,
                        position: 'is-top',
                        type: 'is-success'
                    })
                }else{
                    this.takeCards(1);
                    Toast.open({
                        duration: this.timeout,
                        message: `Przegrałeś...`,
                        position: 'is-top',
                        type: 'is-danger'
                    })
                }
                setTimeout(()=>this.userCanMove = true, 1000);
            },
            checkState() {
                if (this.$store.getters.playerHandLength(0) === 0) this.setGameOver("przegrałeś...");
                else if (this.$store.getters.playerHandLength(1) === 0)  this.setGameOver("wygrałeś!");
            }
        },
        computed: mapGetters([
            'gameState',
            'players',
            'deck',
            'playerHand',
            'playerHandLength',
            'pile',
        ]),
        created() {
            if (this.gameState.gameStatus !== true) {
                this.$router.push('/');
            }
            setTimeout(() => {this.isLoading = false}, 500);
        }
    }
</script>

<style scoped>
    .hero.is-white {
        background-image: linear-gradient(140deg, #e2ffeb -50%, whitesmoke 71%, #b1c0cb 100%)
    }
    .hero-body {
        background-color: #029d55;
    }
    .line {
        width: 100%;
        opacity: 0.35;
        border: 1px solid rgba(255, 255, 255, 0.44);
    }
    .card-container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        padding: 2px;
        height: 229px;
        width: calc(174px * 2);
        background-color: #029d55;
        border: 2px dashed rgba(255,255,255, 0.44);
        display: flex;
    }

    .card-container .card-img {
        padding: 5px;
    }
    
    .card-img {
        height:220px;
        width:170px;
        border-radius:10px;

    }
    .opponent {
        position: fixed;
        left: 0;
        top: 3rem;
        width: 100%;
        height: calc(50vh - 3rem);
    }
    .player {
        position: fixed;
        left: 0;
        bottom: 3rem;
        width: 100%;
        height: calc(50vh - 3.2rem);
    }
    .player-card-pile {
        cursor: pointer;
        position: fixed;
        right: 25vw;
        bottom: 3.5rem;
    }
    .opponent-card-pile {
        cursor: pointer;
        position: fixed;
        left: 25vw;
        top: 4rem;
    }
    .opponent-card-pile img {
        opacity: 0.6;
    }
    .game-info {
        position: fixed;
        right: 2rem;
        top: 4rem;
    }

    @media only screen and (max-width: 600px) {

        .responsive {
            transform: scale(0.92);
        }

        .line {
           display: none;
        }
        .card-container {
            padding: 2px;
            height: 174px;
            width: calc(100% - 50px);
            justify-content: center;
        }

        .card-img {
            height:165px;
            width:115px;
            border-radius:10px;
        }

        .player-card-pile {
            cursor: pointer;
            position: fixed;
            right: 7.5vw;
            bottom: 3rem;
        }
        .opponent-card-pile {
            cursor: pointer;
            position: fixed;
            left: 7.5vw;
            top: 3.5rem;
        }
    }

</style>

