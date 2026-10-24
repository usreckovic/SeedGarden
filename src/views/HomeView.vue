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

</script>

<template>
  <div class="card mb-4" v-if="random">
    <div class="row g-0">
      <h1 class="most-sold">Most Sold</h1>
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
            Details
          </RouterLink>
        </div>
      </div>
    </div>
  </div>

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
            BUY NOW
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.most-sold{
  background-color: #509b54 !important;
  color: white;
  text-align: center;
  padding: 3px;
  margin: 0px;
  border-radius: 5px;
  font-size: 30px;
}
</style>