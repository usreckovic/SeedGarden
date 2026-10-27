<script lang="ts" setup>
import { PlantService } from '@/services/plants.service'
import { UserService } from '@/services/user.service'
import { showError } from '@/utils'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const firstName = ref<string>('')
const lastName = ref<string>('')
const phone = ref<string>('')
const address = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const confirm = ref<string>('')
const selected = ref<string>('')
const categories = ref<string[]>()
const router = useRouter()

PlantService.getPlants()
    .then(data => {
        const list: string[] = []
        for (let plant of data) {
            if (!list.includes(plant.category)) {
                list.push(plant.category)
            }
        }
        categories.value = list
        selected.value = list[0]!
    })

function register() {
    if (password.value != confirm.value) {
        showError('Lozinke se ne poklapaju!')
        return
    }

    const err = UserService.createUser(
        email.value,
        password.value,
        firstName.value,
        lastName.value,
        phone.value,
        address.value,
        selected.value
    )

    if (err == null) {
        router.push('/login')
        return
    }

    showError(err)
}
</script>

<template>
    <div class="row justify-content-center" v-if="categories">
        <div class="col-12 col-md-8 col-lg-6">
            <div class="card">
                <div class="card-header fw-bold">Registracija</div>
                <div class="card-body">
                    <form @submit.prevent="register">
                        <div class="row">
                            <div class="mb-3 col-md-6">
                                <label for="firstName" class="form-label">Ime</label>
                                <input type="text" class="form-control" id="firstName" v-model="firstName" required>
                            </div>
                            <div class="mb-3 col-md-6">
                                <label for="lastName" class="form-label">Prezime</label>
                                <input type="text" class="form-control" id="lastName" v-model="lastName" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email adresa</label>
                            <input type="email" class="form-control" id="email" v-model="email" required>
                        </div>
                        <div class="mb-3">
                            <label for="phone" class="form-label">Broj telefona</label>
                            <input type="tel" class="form-control" id="phone" v-model="phone" required>
                        </div>
                        <div class="mb-3">
                            <label for="address" class="form-label">Adresa</label>
                            <input type="text" class="form-control" id="address" v-model="address" required>
                        </div>
                        <div class="mb-3">
                            <label for="favorite" class="form-label">Omiljena vrsta biljaka</label>
                            <select class="form-select" id="favorite" v-model="selected">
                                <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Lozinka</label>
                            <input type="password" class="form-control" id="password" v-model="password" required>
                        </div>
                        <div class="mb-3">
                            <label for="confirm" class="form-label">Ponovite lozinku</label>
                            <input type="password" class="form-control" id="confirm" v-model="confirm" required>
                        </div>
                        <button type="submit" class="btn btn-success">Registruj se</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>