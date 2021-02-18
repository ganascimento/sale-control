<template>
    <div class="back-arrow-content">
        <p @click="backHome" class="btn"><i class="fas fa-arrow-left"></i></p>

        <div class="title-bar">
            <h3>{{ title }}</h3>
        </div>

        <p v-if="viewProductsAlert && products.length > 0" @click="showDialog = true" style="color: tomato" class="btn"><i class="fas fa-box"></i></p>

        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Produtos com estoque baixo</md-dialog-title>

            <div class="content-modal">
                <table>
                    <thead>
                        <tr>
                            <th width="60%">Produto</th>
                            <th width="20%">Estoque</th>
                            <th width="20%">Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in this.products" :key="product.productCode">
                            <td>{{ product.name }}</td>
                            <td>{{ product.amount }}</td>
                            <td>{{ formatType(product.type) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <md-dialog-actions>
                <md-button class="md-primary" @click="showDialog = false">Fechar</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            title: {
                type: String,
                required: true
            },
            viewProductsAlert: {
                type: Boolean,
                required: false,
                default: false
            },
            products: {
                type: Array,
                required: false
            }
        },
        data() {
            return {
                showDialog: false
            }
        },
        methods: {
            backHome() {
                this.$router.push('/');
            },
            formatType(type) {
                if (type === 2)
                    return 'Unitário';
                else if (type === 1)
                    return 'A granel';
            }
        }
    });
</script>

<style scoped>
    .back-arrow-content {
        width: 95%;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .back-arrow-content p, .back-arrow-content .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        color: rgb(235,235,235);
        font-size: 20px;
    }

    .back-arrow-content .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        cursor: pointer;
        color: rgb(235,235,235);
        font-size: 20px;
    }
    .back-arrow-content .btn:hover {
        background-color: rgba(255,255,255,.2);
    }
    .back-arrow-content .btn:active {
        background-color: rgba(255,255,255,.4);
    }

    .title-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(100% - 80px);
        height: 100%;
    }

    .title-bar h3 {
        margin: 0;
        color: rgb(235,235,235);
        font-weight: bold;
        font-size: 21px;
    }

    .content-modal {
        width: 600px;
    }
</style>