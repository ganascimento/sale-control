<template>
    <div  @keydown="screenFuncions" class="content">
        <BackArrow v-show="!fullScreen" title="Estoque" />        
        <div class="table-content" :class="fullScreen ? 'fullscreen' : ''">
            <div class="table-functions">
                <button @click="fullScreen = !fullScreen"><i class="fas" :class="fullScreen ? 'fa-compress-arrows-alt' : 'fa-expand-arrows-alt'"></i></button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th width="40%">Nome do produto</th>
                        <th width="15%">Tipo</th>
                        <th width="12%">Quantidade</th>
                        <th width="8%">Medida</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in this.items" :key="item.code" :class="classConstruct(item.code, item.productCode)" @click="selectRow(item.code)">
                        <td>{{ item.name }}</td>
                        <td>{{ getTypeByCode(item.type) }}</td>
                        <td>{{ amountFormat(item.amount, item.type) }}</td>
                        <td>{{ measureFormat(item.type) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="content-body" v-show="!fullScreen">
            <div class="form-content">
                <input type="hidden" id="Code" v-model="product.code">

                <div class="form-group ipt-col-6">
                    <label for="Name" ref="name">Nome do produto</label>
                    <input type="text" id="Name" v-model="product.name" disabled="disabled" />
                </div>

                <div class="form-group ipt-col-3">
                    <p>Tipo do produto</p>
                    <div class="btn-select-view">
                        <div v-if="product.type === 2">
                            <button>Unitário</button>
                        </div>
                        <div v-else-if="product.type === 1">
                            <button>A granel</button>
                        </div>
                        <div v-else>
                            <button>Nenhum</button>
                        </div>
                    </div>
                </div>

                <div class="form-group ipt-col-3">
                    <label for="Value">Quantidade do estoque {{ product.type === 1 ? "(em KG)" : product.type === 2 ? "(em unidade)" : ""}}</label>
                    <input type="number" id="Value" v-model.number="product.amount" />
                    <span>{{ valid.amount }}</span>
                </div>
            </div>

            <div class="final-content">
                <button class="default-btn" @click="clearScreen()"><i class="far fa-times-circle"></i> Limpar (Esc)</button>
                <button class="purple-btn" @click="validation()" :disabled="!product.code"><i class="fas fa-plus"></i> Cadastrar (F8)</button>
            </div>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style scoped src="./styles.css"></style>