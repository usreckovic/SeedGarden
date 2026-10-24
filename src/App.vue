<script setup lang="ts">

</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary mb-3 navbar-background">
    <div class="container">
      <RouterLink class="navbar-brand select-nav" to="/">
        <i class="fa-solid fa-leaf" style="font-size: 25px;"></i> SeedGarden
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link select-nav" active-class="active" aria-current="page" to="/">
              Home
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link select-nav" active-class="active" aria-current="page" to="/about">
              About
            </RouterLink>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input class="form-control me-2 search-bg" type="search" placeholder="Search" aria-label="Search" />
          <button class="btn btn-outline-success search-color" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
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
.search-color{
  border-color: #2b532d;
  border-width: 2px;
  color: white;
}
.search-color:hover{
  background-color: #2b532d;
  border-color: #509b54;
}
.select-nav{
  color: white;
}


</style>