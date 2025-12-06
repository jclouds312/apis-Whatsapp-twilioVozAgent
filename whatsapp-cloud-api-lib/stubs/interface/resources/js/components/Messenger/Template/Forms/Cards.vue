<template>
    <div class="form-control">
        <label>Cards</label>
        <button type="button" class="btn w-44" @click="addCard">
            <PlusIcon class="h-4 w-4" /> Agregar un Card
        </button>

        <div class="overflow-x-auto">
            <table class="table table-zebra">
                <thead>
                    <tr>
                        <th>#</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(card, index) in model?.carousel?.cards">
                        <th>{{index+1}}</th>
                        <td>
                            <Card v-model:model="model.carousel.cards[index]" :key="index" :id="index" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>
import { defineModel } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline';
import Card from './Card.vue';

const model = defineModel('model')

function addCard() {
    if (!model.value.carousel) {
        model.value.carousel = {
            cards: []
        };
    }
    model.value.carousel.cards.push({
        components: {
            body: {
                text: '',
            },
            header: {
                format: 'IMAGE',
                example: {
                    header_handle: [],
                },
            },
            buttons: {
                buttons: [
                    {
                        'text': 'Botón',
                        type: 'QUICK_REPLY',
                    }
                ],
            }
        }
    });
}
</script>
