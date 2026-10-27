<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted, watchEffect, computed, reactive } from 'vue'
import { PlantService } from '@/services/plants.service'
import type { PlantModel } from '@/models/plant.model'
import type { OrderModel } from '@/models/order.model'
import { Swal } from 'sweetalert2'
import { showConfirm } from '@/utils';

const route = useRoute()
const id = Number(route.params.id as string);
const category = route.params.category as string;
const plant = ref<PlantModel>()
const other = ref<PlantModel[]>([])
const isFalse = ref<boolean>(false)

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

const order = reactive<Partial<OrderModel>>({
    seedId: 1,
    seedCount: 1
})

function createOrder() {
    showConfirm('Are you sure you want to place an order?', () => {
        UserService.addOrder({
            flightId: order.flightId ?? id,
            createdAt: new Date().toISOString(),
            paidAt: null,
            deletedAt: null,
            isReturnTicket: order.isReturnTicket ?? false,
            flightClass: order.flightClass ?? 'f',
            pricePerTicket: pricePerTicket.value,
            ticketCount: order.ticketCount ?? 1
        })
        router.push('/user')
    })
}

const pricePerSeed = computed(() => {
    if (!plant.value?.price || order.seedCount === undefined) {
        return 0
    }
    if(order.seedCount > plant.value.stockQuantity){
        return "Unet je broj veci od broja dostupnih semenki."
    }
    return "Vasa ukupna cena je " +  plant.value.price * order.seedCount + " " + plant.value.currency
})

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
                        <li class="list-group-item p-md-3 d-flex justify-content-center"><i class="fa-solid fa-bars-staggered"
                                style="color: #509b54; font-size: 20px; padding-right: 10px;"></i>
                            Seme Proizvedeno: {{ plant.productionDate }}</li>
                        <li class="list-group-item p-md-3 d-flex justify-content-center"><i class="fa-solid fa-cubes-stacked"
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
                        <label class="form-label d-flex justify-content-center" style="padding-top: 20px;">{{ pricePerSeed }}</label>
                        <li class="list-group-item d-flex justify-content-center">
                            <RouterLink class="btn btn-primary btn-success" type="submit" value="Rezervisi"
                                style="margin-top: 10px;" :to="`/order/${id}`">
                                <i class="fa-solid fa-cart-shopping"></i> Potvrdi i dodaj u Korpu
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>


</template>