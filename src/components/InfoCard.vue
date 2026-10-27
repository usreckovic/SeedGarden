<script lang="ts" setup>
export interface InfoCardProps {
    title?: string
}

const { title } = defineProps<InfoCardProps>()
</script>

<template>
    <div class="info-card text-center mx-auto mb-4">
        <h4 class="mb-3">{{ title ?? 'Info' }}</h4>
        <div class="info-body">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.info-card {
    max-width: 480px;
    padding: 32px 24px;
    border: 2px solid #509b54;
    border-radius: 16px;
}

h4 {
    color: #3b7a3f;
}

.info-body {
    color: #555;
}
</style>