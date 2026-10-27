<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UserService } from '@/services/user.service'
import { showError } from '@/utils'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')

function login() {
    if (UserService.login(email.value, password.value)) {
        const redirect = String(route.query.redirect ?? '/user')
        router.push(redirect)
    } else {
        showError('Pogrešan email ili lozinka!')
    }
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card shadow-sm">
                <div class="card-header fw-bold">
                    <i class="fa-solid fa-right-to-bracket me-2" style="color: #509b54;"></i>
                    Prijava
                </div>

                <div class="card-body">
                    <form @submit.prevent="login">
                        <div class="mb-3">
                            <label for="email" class="form-label fw-semibold">Email</label>
                            <input id="email" type="email" class="form-control" v-model="email"
                                placeholder="user@example.com" autocomplete="email" required>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label fw-semibold">Lozinka</label>
                            <input id="password" type="password" class="form-control" v-model="password"
                                placeholder="Unesite lozinku" autocomplete="current-password" required>
                        </div>

                        <button type="submit" class="btn btn-success w-100">
                            <i class="fa-solid fa-right-to-bracket me-1"></i> Prijavi se
                        </button>
                    </form>

                    <hr>
                    <p class="text-center mb-0 small">
                        Nemate nalog?
                        <RouterLink to="/register">Registrujte se</RouterLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>