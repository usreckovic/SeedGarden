<script setup lang="ts">
import { useLogin } from '@/hooks/login.hook';
import { UserService } from '@/services/user.service';
import { useRouter } from 'vue-router';
import type { OrderModel } from '@/models/order.model';
import { computed, onMounted, ref } from 'vue';
import { PlantService } from '@/services/plants.service';
import Swal from 'sweetalert2';
import { formatDate, getPriceForSeed, showConfirm, showError, showLoading } from '@/utils';
import ProfileChange from './ProfileChange.vue';

const validateLogin = useLogin()
const user = UserService.getActiveUser()
const router = useRouter()
const orders = ref<OrderModel[]>([])
const stock = ref<Record<number, number>>({})
const passwordReset = ref({
    currentPass: '',
    newPass: '',
    repeatNewPass: ''
})

async function rateOrder(order: OrderModel) {
    const result = await Swal.fire({
        title: 'Oceni biljku',
        html: `
            <label style="display:block; text-align:left; margin-bottom:5px;">Ocena</label>
            <select id="rating" class="form-select" style="margin-bottom:20px;">
                <option value="5">5 - Odlicno</option>
                <option value="4">4 - Vrlo dobro</option>
                <option value="3">3 - Dobro</option>
                <option value="2">2 - Slabo</option>
                <option value="1">1 - Lose</option>
            </select>
            <label style="display:block; text-align:left; margin-bottom:5px;">Recenzija</label>
            <textarea id="review" class="form-control" rows="5"
                placeholder="Napisite recenziju (nije obavezno)">${order.review ?? ''}</textarea>
        `,
        showCancelButton: true,
        confirmButtonText: 'Sacuvaj',
        cancelButtonText: 'Odustani',
        confirmButtonColor: '#509b54',
        padding: '2rem'
    })

    if (!result.isConfirmed) return

    const ratingInput = document.getElementById('rating') as HTMLSelectElement
    const reviewInput = document.getElementById('review') as HTMLTextAreaElement

    const rating = Number(ratingInput.value)
    const review = reviewInput.value

    UserService.setOrderReview(order.createdAt, rating, review)
    order.rating = rating
    order.review = review
}

if (user) {
    PlantService.getPlantByIds(user.orders.map(o => o.seedId))
        .then(plants => {
            for (const order of user.orders) {
                const plant = plants.find(p => p.id === order.seedId)
                if (plant) {
                    order.seedNumber = plant.name
                    stock.value[plant.id] = plant.stockQuantity
                }
            }
            orders.value = user.orders
        })
        .finally(() => Swal.close())
}

const reserved = computed(() => orders.value.filter(o => o.status === 'rezervisano'))
const history = computed(() => orders.value.filter(o => o.status !== 'rezervisano'))

const total = computed(() => {
    let sum = 0
    for (const order of reserved.value) {
        sum += getPriceForSeed(order)
    }
    return sum
})

function confirmOrders() {
    showConfirm('Potvrdi sve rezervacije?', () => {
        for (const order of reserved.value) {
            UserService.setOrderStatus(order.createdAt, 'pristiglo')
            order.status = 'pristiglo'
        }
    })
}

function cancelOrder(order: OrderModel) {
    showConfirm(`Otkazi rezervaciju napravljenu ${formatDate(order.createdAt)}`, () => {
        UserService.setOrderStatus(order.createdAt, 'otkazano')
        order.status = 'otkazano'
    })
}

function removeOrder(order: OrderModel) {
    showConfirm(`Obrisi porudzbinu napravljenu ${formatDate(order.createdAt)}`, () => {
        UserService.removeOrder(order)
        orders.value = orders.value.filter(o => o !== order)
    })
}

function changePassword() {
    showConfirm('Da li ste sigurni da zelite da promenite sifru', () => {
        if (passwordReset.value.newPass === '') {
            showError('Nova sifra ne moze biti prazna')
            return
        }
        if (passwordReset.value.currentPass !== user?.password) {
            showError('Ne tacna sifra')
            return
        }
        if (passwordReset.value.newPass !== passwordReset.value.repeatNewPass) {
            showError('Nova sifra se ne poklapa')
            return
        }
        if (passwordReset.value.newPass === user?.password) {
            showError('Ne mozete korisiti istu sifru')
            return
        }

        UserService.changePassword(passwordReset.value.newPass)
        UserService.logout()
        router.push('/login')
    })
}

function changeCount(order: OrderModel, delta: number) {
    const newCount = order.seedCount + delta

    if (newCount < 1) return

    const max = stock.value[order.seedId]
    if (max !== undefined && newCount > max) {
        showError('Nema vise semenki na stanju')
        return
    }

    order.seedCount = newCount
    UserService.setOrderCount(order.createdAt, newCount)
}

onMounted(() => {
    validateLogin()
    showLoading()
})
</script>

<template>
    <div class="d-flex flex-row gap-3" v-if="user">

        <div class="card" style="flex: 3;">
            <div class="card-header">
                <i class="fa-solid fa-circle-user" style="color: #509b54;"></i> Podaci o korisniku
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center mb-3 me-3">
                    <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=0d6efd&color=ffffff&size=128`"
                        :alt="`${user.email} avatar`" class="rounded-circle border me-3" width="80" height="80" />
                    <div>
                        <h5 class="mb-1">{{ user.firstName }} {{ user.lastName }}</h5>
                        <span class="badge" style="background-color: #509b54;">Registrovan korisnik</span>
                    </div>
                </div>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <i class="fa-solid fa-envelope me-2" style="color: #509b54;"></i>
                    <small class="text-body-secondary d-block">Email</small>
                    <strong>{{ user.email }}</strong>
                </li>
                <li class="list-group-item">
                    <i class="fa-solid fa-seedling me-2" style="color: #509b54;"></i>
                    <small class="text-body-secondary d-block">Omiljena kategorija</small>
                    <strong>{{ user.favoritePlantCategory }}</strong>
                </li>
                <li class="list-group-item">
                    <i class="fa-solid fa-location-dot me-2" style="color: #509b54;"></i>
                    <small class="text-body-secondary d-block">Adresa</small>
                    <strong>{{ user.address }}</strong>
                </li>
                <li class="list-group-item">
                    <i class="fa-solid fa-phone me-2" style="color: #509b54;"></i>
                    <small class="text-body-secondary d-block">Telefon</small>
                    <strong>{{ user.phone }}</strong>
                </li>
                <li class="list-group-item">
                    <i class="fa-solid fa-cart-shopping me-2" style="color: #509b54;"></i>
                    <small class="text-body-secondary d-block">Ukupno porudžbina</small>
                    <strong>{{ orders.length }}</strong>
                </li>
                <li class="list-group-item">
                    <RouterLink :to="`/user/profileChange`">
                        <button class="btn w-100 btn-primary ">
                            <i class="fa-solid fa-keyboard"></i> Izmeni profil
                        </button>
                    </RouterLink>
                </li>
            </ul>
        </div>

        <div style="flex: 6;" class="d-flex flex-column gap-3">
            <div class="card">
                <div class="card-header" style="font-size: 20px;"><i class="fa-solid fa-cart-shopping"></i> Korpa
                    (rezervisano)</div>
                <div class="table-responsive">
                    <table class="table table-striped align-middle mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Biljka</th>
                                <th>Datum i Vreme</th>
                                <th>Kol.</th>
                                <th>Cena</th>
                                <th>Opcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(order, i) in reserved" :key="i">
                                <th>{{ order.seedId }}</th>
                                <td>{{ order.seedNumber }}</td>
                                <td>{{ formatDate(order.createdAt) }}</td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <button class="btn btn-outline-secondary btn-sm" @click="changeCount(order, -1)"
                                            :disabled="order.seedCount <= 1">
                                            <i class="fa-solid fa-minus"></i>
                                        </button>
                                        <span>{{ order.seedCount }}</span>
                                        <button class="btn btn-outline-secondary btn-sm" @click="changeCount(order, 1)">
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </td>
                                <td>{{ getPriceForSeed(order) }} RSD</td>
                                <td>
                                    <RouterLink :to="`/details/${order.seedId}`" class="btn btn-primary btn-sm me-1">
                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    </RouterLink>
                                    <button class="btn btn-warning btn-sm" @click="cancelOrder(order)">
                                        <i class="fa-solid fa-ban"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <span>Ukupno: {{ total }} RSD</span>
                    <button class="btn btn-success" @click="confirmOrders" :disabled="reserved.length == 0">
                        <i class="fa-solid fa-check"></i> Potvrdi
                    </button>
                </div>
            </div>

            <div class="card">
                <div class="card-header" style="font-size: 20px;"><i class="fa-solid fa-clock-rotate-left"></i> Istorija
                    porudžbina</div>
                <div class="table-responsive">
                    <table class="table table-striped align-middle mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Biljka</th>
                                <th>Datum i Vreme</th>
                                <th>Cena</th>
                                <th>Status</th>
                                <th>Opcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(order, i) in history" :key="i">
                                <th>{{ order.seedId }}</th>
                                <td>{{ order.seedNumber }}</td>
                                <td>{{ formatDate(order.createdAt) }}</td>
                                <td>{{ getPriceForSeed(order) }} RSD</td>
                                <td>
                                    <span class="badge bg-success" v-if="order.status == 'pristiglo'">Pristiglo</span>
                                    <span class="badge bg-danger" v-else>Otkazano</span>
                                    <div v-if="order.rating">
                                        <i v-for="n in 5" :key="n" class="fa-star text-warning"
                                            :class="n <= order.rating ? 'fa-solid' : 'fa-regular'"></i>
                                    </div>
                                </td>
                                <td>
                                    <RouterLink :to="`/details/${order.seedId}`" class="btn btn-primary btn-sm me-1 py-0 px-1">
                                        <i class="fa-solid fa-arrow-up-right-from-square "></i>
                                    </RouterLink>
                                    <button class="btn btn-warning btn-sm me-1 py-0 px-1"
                                        v-if="order.status == 'pristiglo'" @click="rateOrder(order)">
                                        <i class="fa-solid fa-star"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm py-0 px-1" v-if="order.status == 'pristiglo'"
                                        @click="removeOrder(order)">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm py-0 px-1" v-if="order.status == 'otkazano'"
                                        @click="removeOrder(order)">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card" style="flex: 3;">
            <div class="card-header">
                <i class="fa-solid fa-lock" style="color: #509b54;"></i> Promena šifre
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Trenutna šifra</label>
                    <input type="password" class="form-control" placeholder="Unesite trenutnu šifru"
                        v-model="passwordReset.currentPass">
                </div>
                <div class="mb-3">
                    <label class="form-label">Nova šifra</label>
                    <input type="password" class="form-control" placeholder="Unesite novu šifru"
                        v-model="passwordReset.newPass">
                </div>
                <div class="mb-3">
                    <label class="form-label">Potvrdite novu šifru</label>
                    <input type="password" class="form-control" placeholder="Ponovite novu šifru"
                        v-model="passwordReset.repeatNewPass">
                </div>
                <div class="text-end">
                    <button class="btn text-white" style="background-color: #509b54;" @click="changePassword">
                        Promeni šifru
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>