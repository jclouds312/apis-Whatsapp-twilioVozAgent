<template>
    <Waba v-model:model="model" />

    <div class="form-control">
        <label for="category">Categoría</label>
        <select v-model="model.category" id="category" class="select select-bordered w-full">
            <option disabled selected>Categoría de la plantilla</option>
            <option value="MARKETING">Marketing</option>
            <option value="UTILITY">Utilidad</option>
            <option value="AUTHENTICATION">Autenticación</option>
        </select>
    </div>
    <div class="form-control">
        <label for="name">Nombre</label>
        <input v-model="model.name" id="name" type="text" placeholder="Nombre de la plantilla"
            class="input input-bordered w-full" />
    </div>
    <div class="form-control">
        <label for="language">Idioma</label>
        <select v-model="model.language" id="language" class="select select-bordered w-full">
            <option disabled selected>Categoría de la plantilla</option>
            <option value="es">Español</option>
            <option value="es_AR">Español (Argentina)</option>
            <option value="es_ES">Español (España)</option>
            <option value="es_MX">Español (México)</option>
        </select>
    </div>

    <Header v-model:model="model" />

    <Body v-model:model="model" />

    <Footer v-model:model="model" />

    <Buttons v-model:model="model.components.buttons" />

    <Cards v-model:model="model.components" />
</template>
<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
import Buttons from './Buttons.vue'
import Body from './Body.vue'
import Waba from './Waba.vue'
import Cards from './Cards.vue'

const model = defineModel('model')
</script>
