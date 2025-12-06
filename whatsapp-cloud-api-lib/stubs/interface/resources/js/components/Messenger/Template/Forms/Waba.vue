<template>
    <div class="form-control">
        <label for="waba">Waba</label>
        <select v-model="model.waba_id" id="waba" class="select select-bordered w-full">
            <option disabled selected>Selecciona una Waba</option>
            <option v-for="waba in wabas" :value="waba.id">{{ waba.name }}</option>
        </select>
    </div>
</template>
<script setup>
const model = defineModel('model')
const wabas = defineModel()

getWaba();
function getWaba() {
    fetch('/api/v1/waba')
        .then(response => response.json())
        .then(data => {
            wabas.value = data.data;
        })
        .catch(error => {
            console.error('Error:', error)
        })
}
</script>
