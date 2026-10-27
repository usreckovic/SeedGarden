<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, watchEffect, computed, reactive, onMounted } from 'vue'
import { PlantService } from '@/services/plants.service'
import type { PlantModel } from '@/models/plant.model'
import type { OrderModel } from '@/models/order.model'
import { showConfirm, showError } from '@/utils';
import { UserService } from '@/services/user.service';
import router from '@/router';
import { useLogin } from '@/hooks/login.hook';
import Swal from 'sweetalert2';

const route = useRoute()
const id = Number(route.params.id as string);
const plant = ref<PlantModel>()
const other = ref<PlantModel[]>([])
const validateLogin = useLogin()
const isValid = computed(() => {
    if (!plant.value) return false

    const count = order.seedCount
    if (count === undefined || !Number.isInteger(count)) return false
    if (count < 1) return false
    if (count > plant.value.stockQuantity) return false

    return true
})


watchEffect(async () => {
    const currentId = Number(route.params.id as string);
    if (!currentId) {
        return
    }

    plant.value = await PlantService.getPlantById(currentId)
})

const order = reactive<Partial<OrderModel>>({
    seedId: 1,
    seedCount: 1
})

function createOrder() {
    showConfirm('Da li zelite da napravite kupovinu?', () => {
        UserService.addOrder({
            seedId: order.seedId ?? id,
            seedCount: order.seedCount ?? 1,
            createdAt: new Date().toISOString(),
            pricePerSeed: pricePerSeed.value,
            status: 'rezervisano'
        })

        Swal.fire({
            icon: 'success',
            title: 'Uspesno rezervisano!',
            text: `${plant.value?.name} (${order.seedCount} kom) je dodata u vasu korpu.`,
            timer: 2000,
            showConfirmButton: false
        })
        router.push('/user')
    })
}



const priceMessge = computed(() => {
    if (!plant.value?.price || order.seedCount === undefined) {
        return 0
    }
    if (order.seedCount > plant.value.stockQuantity) {
        return "Unet je broj veci od broja dostupnih semenki."
    }
    if (order.seedCount < 0) {
        return "Unet je nevazeci broj"
    }
    return "Vasa ukupna cena je " + plant.value.price * order.seedCount + " " + plant.value.currency
})

const pricePerSeed = computed(() => Number(plant.value?.price ?? 0))

onMounted(() => validateLogin())
</script>

<template>
    <div class="row d-flex justify-content-center" v-if="plant">
        <div class="col-md-5">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-start"
                    style="font-size: 30px; background-color: #509b54; color: white ;">
                    <div>
                        <h3>{{ plant.name }}</h3>
                    </div>
                </div>
                <div>
                    <ul class="list-group list-group-flush" style="padding: 10px;">
                        <li class="list-group-item p-md-3 d-flex justify-content-center"><i
                                class="fa-solid fa-bars-staggered"
                                style="color: #509b54; font-size: 20px; padding-right: 10px;"></i>
                            Seme Proizvedeno: {{ plant.productionDate }}</li>
                        <li class="list-group-item p-md-3 d-flex justify-content-center"><i
                                class="fa-solid fa-cubes-stacked"
                                style="color: #509b54; font-size: 20px; padding-right: 10px;"></i>
                            Trenutno
                            na
                            stanju: {{ plant.stockQuantity }}</li>
                        <li class="list-group-item p-md-3">
                            <div>
                                <div class="mb-3">
                                    <label class="form-label">Broj semenki</label>
                                    <input type="number" class="form-control" v-model="order.seedCount" min="1"
                                        :max="plant.stockQuantity" value="1">
                                </div>
                            </div>
                        </li>
                        <label class="form-label d-flex justify-content-center" style="padding-top: 20px;">{{
                            priceMessge }}</label>
                        <li class="list-group-item d-flex justify-content-center">
                            <button class="btn btn-primary btn-success" type="submit" value="Rezervisi"
                                style="margin-top: 10px;" @click="createOrder" :disabled="!isValid">
                                <i class="fa-solid fa-cart-shopping"></i> Potvrdi i dodaj u Korpu
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            
        </div>
    </div>


</template>