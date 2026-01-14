<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <TheWelcome />
    <nav class="home-nav">
      <router-link to="/new">Go to New Page</router-link>
    </nav>
  </main>
</template>
