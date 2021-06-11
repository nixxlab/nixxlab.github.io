<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <h2 class="subtitle is-3">Nixxlab is a compact IT lab specializing in a web development and support services of worldwide projects.</h2>
        <h2 class="subtitle is-3">
          We develop, implement and maintain mobile network data exchange and billing platforms, analytical systems, content shops and landing pages.
        </h2>
        <h2 class="subtitle is-3">
          We use new technologies for providing a qualitative improvement of our services:
        </h2>
        
        <div class="text-center">
          <q-avatar square size="200px">
            <img src="../assets/docker.png" class="grayscale">
          </q-avatar>
          <q-avatar square size="200px">
            <img src="../assets/vuejs.png" class="grayscale">
          </q-avatar>
          <q-avatar square size="200px">
            <img src="../assets/clickhouse.png" class="grayscale">
          </q-avatar>
          <q-avatar square size="200px">
            <img src="../assets/rabbitmq.png" class="grayscale">
          </q-avatar>
          <q-avatar square size="200px">
            <img src="../assets/postgresql.png" class="grayscale">
          </q-avatar>
          <q-avatar square size="200px">
            <img src="../assets/redis.png" class="grayscale">
          </q-avatar>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style scoped>
  img.grayscale {
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
  }
</style>
