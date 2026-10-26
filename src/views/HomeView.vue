<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlantService } from '@/services/plants.service'
import type { PlantModel } from '@/models/plant.model'

const plants = ref<PlantModel[]>([])
const random = ref<PlantModel>()

onMounted(async () => {

  plants.value = await PlantService.getPlants()
  random.value = plants.value[Math.floor(Math.random() * plants.value.length)]

})

function getPlantCategories() {
  const category = new Set<string>()
  plants.value?.forEach(f => {
    category.add(f.category)
  })

  return Array.from(category)
}

function getPlantClimate() {
  const climate = new Set<string>()
  plants.value?.forEach(f => {
    climate.add(f.climate)
  })

  return Array.from(climate)
}

</script>

<template>
  <div class="card mb-4" v-if="random">
    <div class="row g-0">
      <h1 class="details">Najprodavanija biljka</h1>
      <div class="col-md-4">
        <img :src="random.imageUrl" class="img-fluid rounded-start">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">{{ random.name }}</h5>
          <h5 class="card-title" style="font-style: italic; font-size: small;">/{{ random.latinName }}/</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">{{ random.season }}</h6>
          <p class="card-text">{{ random.description }}</p>
          <RouterLink :to="`/details/${random.id}`" class="btn btn-primary">
            Detalji
          </RouterLink>
        </div>
      </div>
    </div>
  </div>

  <nav class="navbar navbar-light bg-light p-md-3 my-4 rounded" style="background-color: #509b54 !important;">

    <div class="col-12 col-md-4 mb-3">
      <label>Pregraga</label>
      <input class="form-control" type="search" placeholder="Pretraga">
    </div>

    <div class="col-12 col-md-2 mb-3">
      <label>Ocena:</label>
      <select class="form-select" name="ratings">
        <option value="0">Any rating</option>
        <option value="5">★★★★★ (5 Stars)</option>
        <option value="4">★★★★☆ (4 Stars)</option>
        <option value="3">★★★☆☆ (3 Stars)</option>
        <option value="2">★★☆☆☆ (2 Stars)</option>
        <option value="1">★☆☆☆☆ (1 Star)</option>
      </select>
    </div>


    <div class="col-12 col-md-4 mb-3">
      <label>Kateogorija: </label>
      <select class="form-select" type="dropdown">
        <option value="any">Kategorija</option>
        <option v-for="category in getPlantCategories()">{{ category }}</option>
      </select>
    </div>

    <div class="col-12 col-md-3 mb-3">
      <label>Klima: </label>
      <select class="form-select" type="dropdown">
        <option value="any">Klima</option>
        <option v-for="climate in getPlantClimate()">{{ climate }}</option>
      </select>
    </div>

    <div class="col-12 col-md-3 mb-3">
      <label>Cena: </label>
      <select class="form-select" type="dropdown">
      </select>
    </div>

  </nav>

  <div class="row">
    <div class="col-12 col-md-4 mb-4" v-for="p in plants" :key="p.id">
      <div class="card text-center">
        <img :src="p.imageUrl" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">{{ p.name }}</h5>
          <h5 class="card-title" style="font-style: italic; font-size: small;">/{{ p.latinName }}/</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">{{ p.season }}</h6>
          <RouterLink :to="`/details/${p.id}`" class="btn btn-primary m1" style="margin-right: 5px;">
            Details
          </RouterLink>
          <RouterLink :to="`/details/${p.id}`" class="btn btn-success m1">
            Kupi odmah
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>