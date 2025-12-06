<template>
    <div class="form-control">
        <label for="body">Cuerpo del mensaje</label>
        <textarea v-model="model.components.body.text" id="body" class="textarea textarea-bordered w-ful resize-none"
            placeholder=""></textarea>
    </div>
</template>
<script setup>
const model = defineModel('model')
</script>
