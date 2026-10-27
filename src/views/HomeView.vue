<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { PlantService } from '@/services/plants.service'
import type { PlantModel } from '@/models/plant.model'
import { useRoute } from 'vue-router'

const plants = ref<PlantModel[]>([])
const random = ref<PlantModel>()
const router = useRoute()
const name = ref(String(router.query.search ?? ''))

function resetFilters() {
  selectedCategory.value = '',
    selectedClimate.value = '',
    selectedUser.value = '',
    name.value = '',
    priceIndex.value = Math.max(prices.value.length - 1, 0)
}

onMounted(async () => {
  plants.value = await PlantService.getPlants()
  random.value = plants.value[Math.floor(Math.random() * plants.value.length)]
  priceIndex.value = Math.max(prices.value.length - 1, 0)
})

watch(() => router.query.search, (q) => {
  name.value = String(q ?? '')
})

const selectedCategory = ref<string>('')
const selectedClimate = ref<string>('')
const selectedUser = ref<string>('')


const filtered = computed(() =>
  plants.value.filter(p =>
    p.name.toLowerCase().includes(name.value.toLowerCase()) &&
    (selectedCategory.value === '' || p.category === selectedCategory.value) &&
    (selectedClimate.value === '' || p.climate === selectedClimate.value) &&
    (selectedUser.value === '' || p.target_audience === selectedUser.value) &&
    Number(p.price) <= selectedPrice.value
  )
)

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

function getPlantUsers() {
  const users = new Set<string>()
  plants.value?.forEach(f => {
    users.add(f.target_audience)
  })

  return Array.from(users)
}

const prices = computed(() => {
  const list: number[] = []

  for (const p of plants.value) {
    const price = Number(p.price)
    if (!list.includes(price)) {
      list.push(price)
    }
  }

  return list.sort((a, b) => a - b)
})

const minPrice = computed(() => prices.value[0] ?? 0)
const maxPrice = computed(() => prices.value[prices.value.length - 1] ?? 0)

const priceIndex = ref(0)
const selectedPrice = computed(() => prices.value[priceIndex.value] ?? 0)
</script>

<template>
  <div class="card mb-4" v-if="random">
    <div class="row g-0">
      <h1 class="details">Nasumicna biljka</h1>
      <div class="col-md-4">
        <img :src="random.imageUrl" class="img-fluid rounded-start">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">{{ random.name }}</h5>
          <h5 class="card-title" style="font-style: italic; font-size: small;">/{{ random.latinName }}/</h5>
          <i class="fa-solid fa-sun" style="color: #509b54;"></i>
          {{ random.season }}
          <p class="card-text"><i class="fa-brands fa-readme" style="color: #509b54;"></i> {{ random.description }}</p>
          <RouterLink :to="`/details/${random.id}`" class="btn btn-primary">
            Detalji
          </RouterLink>
        </div>
      </div>
    </div>
  </div>

  <nav class="navbar navbar-light bg-light p-md-3 my-4 rounded"
    style="background-color: #509b54 !important; color: white !important;">

    <div class="col-12 col-md-5 mb-3">
      <label>Pretraga</label>
      <input v-model="name" class="form-control" type="search" placeholder="Pretraga po Imenu">
    </div>

    <div class="col-12 col-md-2 mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-primary" @click="resetFilters()">
        Reset
      </button>
    </div>

    <div class="col-12 col-md-5 mb-3">
      <label>Kategorija: </label>
      <select v-model="selectedCategory" class="form-select">
        <option value="">Bilo koja</option>
        <option v-for="ca in getPlantCategories()" :key="ca" :value=ca>{{ ca }}</option>
      </select>
    </div>

    <div class="col-12 col-md-4 mb-3">
      <label>Iskustvo: </label>
      <select v-model="selectedUser" class="form-select" type="dropdown">
        <option value="">Bilo koje</option>
        <option v-for="user in getPlantUsers()" :value="user" :key="user">{{ user }}</option>
      </select>
    </div>

    <div class="col-12 col-md-2 mb-3">
      <label>Klima: </label>
      <select v-model="selectedClimate" class="form-select" type="dropdown">
        <option value="">Bilo koja</option>
        <option v-for="cl in getPlantClimate()" :value="cl" :key="cl">{{ cl }}</option>
      </select>
    </div>

    <div class="col-12 col-md-4 mb-3">
      <label>Cena do: {{ selectedPrice }} RSD</label>
      <input type="range" class="form-range" min="0" :max="Math.max(prices.length - 1, 0)" step="1"
        v-model.number="priceIndex">
      <div class="d-flex justify-content-between small text-body-secondary">
        <span>{{ minPrice }}</span>
        <span>{{ maxPrice }}</span>
      </div>
    </div>

  </nav>

  <div class="row">
    <div class="col-12 col-md-4 mb-4" v-for="p in filtered" :key="p.id">
      <div class="card text-center">
        <img :src="p.imageUrl" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">{{ p.name }}</h5>
          <h5 class="card-title" style="font-style: italic; font-size: small;">/{{ p.latinName }}/</h5>
          <RouterLink :to="`/details/${p.id}`" class="btn btn-primary m1" style="margin-right: 5px;">
            Details
          </RouterLink>
          <RouterLink :to="`/order/${p.id}`" class="btn btn-success m1">
            Kupi odmah
          </RouterLink>
        </div>
      </div>
    </div>
  </div>

  <InfoCard title="Not Found" v-if="filtered.length == 0 && filtered.length < plants.length">
    <p>Couldn't find any departures for that criteria!</p>
    <button type="button" class="btn btn-primary" @click="resetFilters()">
      Reset Filters
    </button>
  </InfoCard>
</template>