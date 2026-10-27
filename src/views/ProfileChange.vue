<script setup lang="ts">
import { UserService } from '@/services/user.service';
import { PlantService } from '@/services/plants.service';
import type { PlantModel } from '@/models/plant.model';
import { onMounted, ref } from 'vue';
import { showConfirm, showError } from '@/utils';
import Swal from 'sweetalert2';
import router from '@/router';


const user = UserService.getActiveUser()
const plants = ref<PlantModel[]>([])
const emailOld = user?.email ?? ''

onMounted(() => {
    PlantService.getPlants().then(data => {
        plants.value = data
    })
})

function getPlantCategories() {
    const category = new Set<string>()
    plants.value?.forEach(f => {
        category.add(f.category)
    })

    return Array.from(category)
}

function saveProfile() {
    if (!user) return

    if (user.firstName === '' || user.lastName === '') {
        showError('Ime i prezime ne mogu biti prazni')
        return
    }

    if (!user.email.includes('@')) {
        showError('Email nije validan')
        return
    }

    if (!/^\+?\d[\d ]*$/.test(user.phone)) {
        showError('Telefon ne moze imate karaktere')
        return
    }

    if (user.firstName.includes(' ') || user.lastName.includes(' ')) {
        showError('Ime i prezime ne mogu imati razmake')
        return
    }

    showConfirm('Sacuvaj izmene?', () => {
        UserService.updateUser(user, emailOld)
        Swal.fire('Sacuvano', 'Podaci su izmenjeni', 'success')
        router.push('/user')
    })
}


</script>

<template>
    <div class="row justify-content-center" v-if="user">
        <div class="col-12 col-md-6 ">
            <ul class="list-group">
                <li class="list-group-item">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="firstName">Ime</label>
                            <input type="text" class="form-control" id="firstName" v-model="user.firstName">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="lastName">Prezime</label>
                            <input type="text" class="form-control" id="lastName" v-model="user.lastName">
                        </div>
                    </div>
                </li>

                <li class="list-group-item">
                    <div class="mb-3">
                        <label class="form-label" for="email">Email</label>
                        <input type="text" class="form-control" id="email" v-model="user.email">
                    </div>
                </li>

                <li class="list-group-item">
                    <div class="mb-3">
                        <label class="form-label" for="category">Omiljena kategorija</label>
                        <select class="form-select" id="category" v-model="user.favoritePlantCategory">
                            <option v-for="ca in getPlantCategories()" :key="ca" :value="ca">{{ ca }}</option>
                        </select>
                    </div>
                </li>

                <li class="list-group-item">
                    <div class="mb-3">
                        <label class="form-label" for="address">Adresa</label>
                        <input type="text" class="form-control" id="address" v-model="user.address">
                    </div>
                </li>

                <li class="list-group-item">
                    <div class="mb-3">
                        <label class="form-label" for="phone">Telefon</label>
                        <input type="text" class="form-control" id="phone" v-model="user.phone">
                    </div>
                </li>

                <li class="list-group-item">
                    <button class="btn w-100 btn-success" @click="saveProfile()">
                        <i class="fa-solid fa-floppy-disk"></i> Sacuvaj
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>