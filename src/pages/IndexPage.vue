<template>
  <q-page padding>
    <div class="banner">
      <div class="text-center">
        <h1>Web development and support services</h1>
        <h3>
          Highload / Big data / Scaling
        </h3>
      </div>
    </div>

    <div class="ocean">
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'IndexPage'
}
</script>

<style scoped>
  .banner {
    align-items: center;
    display: flex;
    height: 60vh;
    justify-content: center;
  }

  .ocean {
    background: #FF8049;
    bottom: 0;
    height: 5%;
    left: 0;
    overflow-x: clip;
    position: absolute;
    width: 100%;
  }

  .wave {
    background: url(../assets/orange_wave.svg) repeat-x;
    position: absolute;
    top: -198px;
    width: 6400px;
    height: 198px;
    animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
    transform: translate3d(0, 0, 0);
  }

  .wave:nth-of-type(2) {
    top: -175px;
    animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 7s ease -1.25s infinite;
    opacity: 1;
  }

  @keyframes wave {
    0% {
      margin-left: 0;
    }

    100% {
      margin-left: -1600px;
    }
  }

  @keyframes swell {
    0%,
    100% {
      transform: translate3d(0, -25px, 0);
    }

    50% {
      transform: translate3d(0, 5px, 0);
    }
  }
</style>
