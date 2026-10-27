<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted, watchEffect } from 'vue'
import { PlantService } from '@/services/plants.service'
import type { PlantModel } from '@/models/plant.model'

const route = useRoute()
const id = Number(route.params.id as string);
const category = route.params.category as string;
const plant = ref<PlantModel>()
const other = ref<PlantModel[]>([])

watchEffect(async () => {
   const currentId = Number(route.params.id as string);
   if (!currentId) {
      return
   }

   plant.value = await PlantService.getPlantById(currentId)
   if (plant.value) {
      other.value = await PlantService.getPlantsByCategory(plant.value.category);
   }
})
</script>

<template>
   <div class="row" v-if="plant">
      <div class="col-md-6">
         <div class="card">
            <img class="card-img" :src="plant.imageUrl" :alt="plant.imageAlt">
            <div class="card-img-overlay d-flex flex-column justify-content-end align-items-end">
               <span class="badge bg-primary">{{ plant.category }}</span>
               <h5>{{ plant.name }}</h5>
            </div>
         </div>
      </div>
      <div class="col-md-6">
         <div class="card">
            <div class="card-header d-flex justify-content-between align-items-start"
               style="font-size: 30px; background-color: #509b54; color: white ;">
               <div>
                  <h3>{{ plant.name }}</h3>
                  <h5 class="card-title" style="font-style: italic; font-size: small;">/{{ plant.latinName }}/</h5>
               </div>
               <span class="badge bg-light text-dark fs-6">ID: {{ plant.id }}</span>
            </div>
            <div>
               <ul class="list-group list-group-flush" style="padding: 10px;">
                  <li class="list-group-item p-md-3"><i class="fa-brands fa-canadian-maple-leaf"
                        style="color: #509b54; font-size: 20px;"></i> Klima: {{ plant.climate }}</li>
                  <li class="list-group-item p-md-3"><i class="fa-solid fa-bars-staggered"
                        style="color: #509b54; font-size: 20px;"></i>
                     Kategorija: {{ plant.category }}</li>
                  <li class="list-group-item p-md-3"><i class="fa-solid fa-cubes-stacked"
                        style="color: #509b54; font-size: 20px;"></i>
                     Trenutno
                     na
                     stanju: {{ plant.stockQuantity }}</li>
                  <li class="list-group-item p-md-3">
                     <i class="fa-solid fa-sun" style="color: #509b54; font-size: 20px;"></i>
                     Godisnje doba: {{ plant.season }}
                  </li>
                  <li class="list-group-item p-md-3"><i class="fa-solid fa-calendar-day"
                        style="color: #509b54; font-size: 20px; padding-bottom: 5%;"></i>
                     Datum proizvodnje: {{ plant.productionDate }}</li>
                  <li class="list-group-item">
                     <RouterLink class="btn btn-primary" type="submit" value="Rezervisi" style="margin-top: 10px;"
                        :to="`/order/${id}`">
                        <i class="fa-solid fa-cart-shopping"></i> Rezervisi
                     </RouterLink>
                  </li>
               </ul>
            </div>
         </div>
      </div>
   </div>

   <div class="card mt-3" v-if="plant">
      <div class="card-header d-flex justify-content-between align-items-start"
         style="font-size: 30px; background-color: #509b54; color: white ;">
         <div>
            <h5 style="background-color: #509b54; border-radius: 5px; color: white; margin: 0px;">
               <i class="fa-solid fa-circle-info"></i> Jos Informacija:
            </h5>
         </div>
      </div>
      <div>
         <ul class="list-group list-group-flush" style="padding: 10px;">
            <li class="list-group-item p-md-3"><i class="fa-brands fa-readme" style="color: #509b54;"></i>
               Deskripcija: {{ plant.description }}</li>
            <li class="list-group-item p-md-3"><i class="fa-solid fa-seedling" style="color: #509b54;"></i>
               Koriscenje: {{ plant.planting_instructions }}</li>
            <li class="list-group-item p-md-3"><i class="fa-solid fa-hand-holding-heart" style="color: #509b54;"></i>
               Drzati u: {{ plant.intended_use }}</li>
            <li class="list-group-item p-md-3"><i class="fa-solid fa-person-rays" style="color: #509b54"></i>
               Preporucujemo za: {{ plant.target_audience }}</li>
         </ul>
      </div>
   </div>

   <div class="row">
      <div class="col-12 mb-3 mt-3">
         <h5 style="background-color: #509b54; padding: 10px; border-radius: 5px; color: white; margin: 0px;">
            <i class="fa-solid fa-bars-staggered" style="font-size: 20px;"></i> Biljke u istoj
            kategoriji:
         </h5>
      </div>
      <div class="col-12 col-md-2 mb-2" style="display:grid;height: 150px;" v-for="o in other" :key="o.id">
         <div class="card text-center">
            <div class="card-body">
               <h5 class="card-title">{{ o.name }}</h5>
               <h6 class="card-subtitle mb-2 text-body-secondary">{{ o.season }}</h6>
               <RouterLink :to="`/details/${o.id}`" class="btn btn-primary m1"
                  style="margin-right: 5px; top: 70%; bottom: 5%;left: 30%; right: auto; position: absolute;">
                  Detalji
               </RouterLink>
            </div>
         </div>
      </div>
   </div>

</template>