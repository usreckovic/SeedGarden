<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { PlantService } from '@/services/plants.service'
import type { PlantModel } from '@/models/plant.model'
import { useRoute } from 'vue-router'
import { UserService } from '@/services/user.service'

const plants = ref<PlantModel[]>([])
const random = ref<PlantModel>()
const router = useRoute()
const name = ref(String(router.query.search ?? ''))
const showMore = ref(false)

const selectedCategory = ref<string>('')
const selectedClimate = ref<string>('')
const selectedUser = ref<string>('')
const selectedDescription = ref('')
const selectedDateFrom = ref('')
const selectedMinRating = ref(0)

function resetFilters() {
  selectedCategory.value = ''
  selectedClimate.value = ''
  selectedUser.value = ''
  name.value = ''
  priceIndex.value = Math.max(prices.value.length - 1, 0)
  selectedDescription.value = ''
  selectedDateFrom.value = ''
  selectedMinRating.value = 0
}

onMounted(async () => {
  plants.value = await PlantService.getPlants()
  random.value = plants.value[Math.floor(Math.random() * plants.value.length)]
  priceIndex.value = Math.max(prices.value.length - 1, 0)
})

watch(() => router.query.search, (q) => {
  name.value = String(q ?? '')
})

const filtered = computed(() =>
  plants.value.filter(p =>
    p.name.toLowerCase().includes(name.value.toLowerCase()) &&
    (selectedCategory.value === '' || p.category === selectedCategory.value) &&
    (selectedClimate.value === '' || p.climate === selectedClimate.value) &&
    (selectedUser.value === '' || p.target_audience === selectedUser.value) &&
    Number(p.price) <= selectedPrice.value &&
    (selectedDescription.value === '' ||
      (p.description ?? '').toLowerCase().includes(selectedDescription.value.toLowerCase())) &&
    (selectedDateFrom.value === '' || p.productionDate >= selectedDateFrom.value) &&
    (selectedMinRating.value === 0 || getRating(p.id) >= selectedMinRating.value)
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

function getRating(id: number) {
  return UserService.getAverageRating(id)
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
          <div v-if="getRating(random.id) > 0">
            <i v-for="n in 5" :key="n" class="fa-star text-warning"
              :class="n <= Math.round(getRating(random.id)) ? 'fa-solid' : 'fa-regular'"></i>
          </div>
          <i class="fa-solid fa-sun" style="color: #509b54;"></i>
          {{ random.season }}
          <p class="card-text"><i class="fa-brands fa-readme" style="color: #509b54;"></i> {{ random.description }}</p>
          <RouterLink :to="`/details/${random.id}`" class="btn btn-primary" style="margin-right: 10px;">
            <i class="fa-solid fa-square-up-right"></i> Detalji
          </RouterLink>
          <RouterLink :to="`/order/${random.id}`" class="btn btn-success m1">
            <i class="fa-solid fa-cart-shopping"></i> Kupi odmah
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

    <div class="col-12 col-md-2 mb-3 d-flex flex-column align-items-center gap-2">
      <button type="button" class="btn btn-primary" @click="resetFilters()">
        Reset
      </button>
      <button class="btn btn-outline-light btn-sm" @click="showMore = !showMore">
        <span v-if="showMore"><i class="fa-solid fa-chevron-up"></i> Manje filtera</span>
        <span v-else><i class="fa-solid fa-chevron-down"></i> Još filtera</span>
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

    <div class="col-12 col-md-3 mb-3" v-if="showMore">
      <label>Opis: </label>
      <input v-model="selectedDescription" class="form-control" type="search"
        placeholder="Pretraga po opisu (sadnja, nega...)">
    </div>

    <div class="col-12 col-md-3 mb-3" v-if="showMore">
      <label>Proizvedeno posle: </label>
      <input v-model="selectedDateFrom" class="form-control" type="date">
    </div>

    <div class="col-12 col-md-3 mb-3" v-if="showMore">
      <label>Minimalna ocena: </label>
      <select v-model.number="selectedMinRating" class="form-select">
        <option :value="0">Bilo koja</option>
        <option :value="1">1+ zvezdica</option>
        <option :value="2">2+ zvezdice</option>
        <option :value="3">3+ zvezdice</option>
        <option :value="4">4+ zvezdice</option>
        <option :value="5">5 zvezdica</option>
      </select>
    </div>


  </nav>

  <div class="row">
    <div class="col-12 col-md-4 mb-4" v-for="p in filtered" :key="p.id">
      <div class="card text-center">
        <img :src="p.imageUrl" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">{{ p.name }}</h5>
          <h5 class="card-title" style="font-style: italic; font-size: small;">/{{ p.latinName }}/</h5>
          <div v-if="getRating(p.id) > 0">
            <i v-for="n in 5" :key="n" class="fa-star text-warning"
              :class="n <= Math.round(getRating(p.id)) ? 'fa-solid' : 'fa-regular'"></i>
          </div>
          <RouterLink :to="`/details/${p.id}`" class="btn btn-primary m1" style="margin-right: 5px;">
            <i class="fa-solid fa-square-up-right"></i> Detalji
          </RouterLink>
          <RouterLink :to="`/order/${p.id}`" class="btn btn-success m1">
            <i class="fa-solid fa-cart-shopping"></i> Kupi odmah
          </RouterLink>
        </div>
      </div>
    </div>
  </div>

  <InfoCard title="Nije pronađeno" v-if="filtered.length == 0 && filtered.length < plants.length">
    <p>Nema biljaka za izabrane kriterijume!</p>
    <button type="button" class="btn btn-primary" @click="resetFilters()">
      Resetuj filtere
    </button>
  </InfoCard>
</template>