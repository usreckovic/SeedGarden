<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const searchInput = ref<string>('')
const router = useRouter()

function search() {
  const q = searchInput.value;

  if (q == '')
    return;

  searchInput.value = '';

  router.push({
    path: '/',
    query: {
      search: q
    }
  });
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary mb-3 navbar-background">
    <div class="container">
      <RouterLink class="navbar-brand nav-color" to="/">
        <i class="fa-solid fa-leaf nav-color" style="font-size: 25px; "></i> SeedGarden
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link nav-color" active-class="active" to="/">
              <i class="fa-solid fa-house"></i> Home
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link nav-color" active-class="active" aria-current="page" to="/about">
              <i class="fa-solid fa-circle-info"></i> About
            </RouterLink>
          </li>
        </ul>
        <form class="d-flex" role="search" @submit.prevent="search">
          <input class="form-control me-2 search-bg" v-model="searchInput" type="search" placeholder="Pretraga"
            aria-label="Search" />
          <button class="btn btn-outline-success search-color" type="submit"><i
              class="fa-solid fa-magnifying-glass"></i></button>
        </form>
      </div>
    </div>
  </nav>
  <div class="container">
    <RouterView />
  </div>
</template>
<style>
.navbar-background {
  background-color: #509b54 !important;
}

.search-color {
  border-color: #2b532d;
  border-width: 2px;
  color: white;
}

.search-color:hover {
  background-color: #2b532d;
  border-color: #509b54;
}

.nav-color {
  color: white;
}

.nav-color:hover {
  color: #2b532d;
}

.nav-color:focus {
  color: white;
}

.nav-color.active {
  color: #2b532d !important;
}

.details {
  background-color: #509b54 !important;
  color: white;
  text-align: center;
  padding: 3px;
  margin: 0px;
  border-radius: 5px;
  font-size: 30px;
}
</style>