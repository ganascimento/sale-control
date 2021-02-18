<template>
    <div @keydown="screenFuncions" class="content">
        <BackArrow v-show="!fullScreen" title="Cadastro de produto" />
        <div class="table-content" :class="fullScreen ? 'fullscreen' : ''">
            <div class="table-functions">
                <button @click="handleEditManyItems"><i class="fas" :class="editManyItems ? 'fa-times' : 'fa-pencil'"></i></button>
                <button @click="fullScreen = !fullScreen"><i class="fas" :class="fullScreen ? 'fa-compress-arrows-alt' : 'fa-expand-arrows-alt'"></i></button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th width="5%" v-show="editManyItems">
                            <md-switch v-model="selectAll" class="md-primary" style="margin: 0"></md-switch>
                        </th>
                        <th width="30%">Chave</th>
                        <th width="40%">Nome do produto</th>
                        <th width="15%">Valor unitário / KG</th>
                        <th width="15%">Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in this.items" :key="item.code" :class="selectedRowCode === item.code ? 'select-row' : ''" @click="selectRow(item.code)">
                        <td v-show="editManyItems">
                            <md-switch v-model="selectedProducts" :value="item.code" class="md-primary" style="margin: 0"></md-switch>
                        </td>
                        <td>{{ item.keyCode }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.value | formatMoney }}</td>
                        <td>{{ getTypeByCode(item.type) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="content-body" v-show="!fullScreen">
            <div class="form-content">
                <input type="hidden" id="Code" v-model="product.code">

                <div class="form-group ipt-col-9">
                    <label for="Name" ref="name">Nome do produto</label>
                    <input type="text" id="Name" v-model="product.name" :disabled="editManyItems" />
                    <span>{{ valid.name }}</span>
                </div>

                <div class="form-group ipt-col-3">
                    <label for="Value">Valor unitário</label>
                    <input type="number" id="Value" v-model.number="product.value" />
                    <span>{{ valid.value }}</span>
                </div>

                <div class="form-group ipt-col-9">
                    <label for="KeyCode">Chave</label>
                    <input type="text" id="KeyCode" v-model="product.keyCode" :disabled="editManyItems" />
                    <span>{{ valid.keyCode }}</span>
                </div>

                <div class="form-group ipt-col-3">
                    <p>Tipo do produto</p>
                    <div class="btn-select">
                        <button :class="this.product.type === 2 ? 'select':''" @click="product.type = 2">Unitário</button>
                        <button :class="this.product.type === 1 ? 'select':''" @click="product.type = 1">A granel</button>
                    </div>
                </div>
            </div>

            <div class="final-content">
                <button class="default-btn" @click="clearScreen()"><i class="far fa-times-circle"></i> Limpar (Esc)</button>
                <div v-if="selectedRowCode === null">
                    <button class="purple-btn" @click="validation()"><i class="fas fa-plus"></i> Cadastrar (F8)</button>
                </div>
                <div v-else>
                    <button class="danger-btn" @click="removeProduct()"><i class="fas fa-trash"></i> Remover (F6)</button>
                    <button class="purple-btn" @click="validation()"><i class="fas fa-pencil"></i> Alterar (F8)</button>
                </div>            
            </div>
        </div>
    </div>
</template>

<script src="./script.js"></script>

<style scoped src="./styles.css"></style>