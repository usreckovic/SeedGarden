<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue'
import { PlantService } from '@/services/plants.service'
import type { PlantModel } from '@/models/plant.model'
import type { PlantDetailsModel } from '@/models/plant-details.model';

const route = useRoute()
const id = Number(route.params.id as string);
const category = route.params.category as string;
const plant = ref<PlantDetailsModel>()
const other = ref<PlantModel[]>([])

onMounted(async () => {

   plant.value = await PlantService.getPlantById(Number(route.params.id))
   other.value = await PlantService.getPlantsByCategory(plant.value.category)

})
</script>

<template>
   <div class="row" v-if="plant">
      <div class="card col-md-6" style="padding: 0px;">
         <img class="card-img" :src="plant.imageUrl" :alt="plant.imageAlt">
         <div class="card-img-overlay d-flex flex-column justify-content-end align-items-end">
            <span class="badge bg-primary">{{ plant.category }}</span>
            <h5>{{ plant.name }}</h5>
         </div>
      </div>
      <div class="col-md-6">
         <div class="card">
            <div class="card-header d-flex justify-content-between align-items-start"
               style="font-size: 30px; background-color: #509b54; color: white;">
               <div>
                  <h3>{{ plant.name }}</h3>
                  <h5 class="card-title" style="font-style: italic; font-size: small;">/{{ plant.latinName }}/</h5>
               </div>
               <span class="badge bg-light text-dark fs-6">ID: {{ plant.id }}</span>
            </div>
            <ul class="list-group list-group-flush" style="padding: 10px;">
               <li class="list-group-item"><i class="fa-brands fa-canadian-maple-leaf"
                     style="color: #509b54; font-size: larger;"></i> Klima: {{ plant.climate }}</li>
               <li class="list-group-item"><i class="fa-solid fa-bars-staggered" style="color: #509b54;"></i>
                  Kategorija: {{ plant.category }}</li>
               <li class="list-group-item"><i class="fa-solid fa-cubes-stacked" style="color: #509b54;"></i> Treunto na
                  stanju: {{ plant.stockQuantity }}</li>
               <li class="list-group-item">{{ plant.price }} {{ plant.currency }} <input class="btn btn-primary"
                     type="submit" value="Kupi"></li>
            </ul>
         </div>
      </div>
   </div>

   <div class="row">
      <div class="col-12 col-md-3 mb-2" v-for="o in other" :key="o.id">
         <div class="card text-center">
            <div class="card-body">
               <h5 class="card-title">{{ o.name }}</h5>
               <h5 class="card-title" style="font-style: italic; font-size: small;">/{{ o.latinName }}/</h5>
               <h6 class="card-subtitle mb-2 text-body-secondary">{{ o.season }}</h6>
               <RouterLink :to="`/details/${o.id}`" class="btn btn-primary m1" style="margin-right: 5px;">
                  Details
               </RouterLink>
               <RouterLink :to="`/details/${o.id}`" class="btn btn-success m1">
                  Kupi odmah
               </RouterLink>
            </div>
         </div>
      </div>
   </div>

</template>