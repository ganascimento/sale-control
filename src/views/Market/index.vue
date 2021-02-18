<template>    
    <div @keydown="screenFuncions" class="content">
        <BackArrow title="Ponto de venda" :viewProductsAlert="true" :products="productsAlert" />
        <div class="header-content">
            <input 
                type="text" 
                placeholder="Informe o código ou leia o código de barras"
                @keydown.enter="addItem"
                v-model="inputValue"
                ref="product" />
            <button class="primary-btn" @click="addItem"><i class="fas fa-plus"></i> Adicionar produto (Enter)</button>
        </div>
        <div class="table-content">
            <table>
                <thead>
                    <tr>
                        <th width="10%">Nº</th>
                        <th width="47%">Nome do produto</th>
                        <th width="14%">Quantidade</th>
                        <th width="14%">Valor unitário / KG</th>
                        <th width="14%">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in this.items" :key="item.number" :class="selectedRowNumber === item.number ? 'select-row' : ''" @click="selectRow(item.number)">
                        <td>{{ item.number }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ formatByType(item.amount, item.type) }}</td>
                        <td>{{ item.value | formatMoney }}</td>
                        <td>{{ item.total | formatMoney }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="footer-content">
            <div class="align-start first">
                <div class="info-box">
                    <p>{{ weight | formatWeight }}</p>
                    <span>Peso (KG)</span>
                </div>
                <div class="info-box">
                    <p>{{ amountItens == '' ? '0' : amountItens }}</p>
                    <span>Quantidade</span>
                </div>
            </div>
            <div class="align-end second">
                <div class="info-box">
                    <p>{{ getQuantity }}</p>
                    <span>Itens</span>
                </div>
                <div class="info-box">
                    <p>{{ formatTotal }}</p>
                    <span>Total</span>
                </div>
            </div>
        </div>
        <div class="final-content">
            <div class="action-list-info">
                <div>
                    <p>F1 - Menu de produtos</p>
                    <p>F2 - Alerar quantidade</p>   
                </div>
                <div>
                    <p>F3 - Histórico de vendas</p>  
                </div>
            </div>
            <div>
                <button class="default-btn" @click="clearScreen"><i class="far fa-times-circle"></i> Limpar (Esc)</button>
                <button class="danger-btn" @click="removeProduct()" v-show="selectedRowNumber !== null"><i class="fas fa-trash"></i> Remover (F6)</button>
                <button class="purple-btn" @click="finishSale" :disabled="items.length === 0"><i class="fas fa-shopping-cart"></i> Finalizar venda (F8)</button>
            </div>
        </div>

        <md-dialog :md-active.sync="showDialogProduct" @keyup.esc="closeModal">
            <md-dialog-title>Produtos</md-dialog-title>

            <div class="content-modal product-list">
                <table>
                    <thead>
                        <tr>
                            <th width="60%">Produto</th>
                            <th width="20%">Código</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in this.products" :key="product.productCode">
                            <td>{{ product.name }}</td>
                            <td>{{ product.keyCode }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeModal">Fechar</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog :md-active.sync="showDialogAmount">
            <div class="content-modal">
                <div class="form-content">
                    <div class="form-group">
                        <label for="Name" ref="name">Quantidade de produto</label>
                        <input ref="amountInput" type="number" id="Name" v-model="amountItens" @keyup.enter="setValueAmount" @keyup.esc="resetValueAmount" />
                    </div>
                </div>
            </div>

            <md-dialog-actions>
                <md-button class="md-primary" @click="showDialogAmount = false">Alterar</md-button>
                <md-button class="md-primary" @click="showDialogAmount = false">Fechar</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog :md-active.sync="showDialogSellsHistory" @keyup.esc="closeModalSellsHistory">
            <md-dialog-title>Histórico de vendas</md-dialog-title>

            <div class="content-modal product-list">
                <table>
                    <thead>
                        <tr>
                            <th width="60%">Código da venda</th>
                            <th width="20%">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="row-table-sale" v-for="sale in this.sales" :key="sale.code" @click="rowTableSaleClick(sale)">
                            <td>{{ sale.code }}</td>
                            <td>{{ sale.value | formatMoney }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeModalSellsHistory">Fechar</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog :md-active.sync="showDialogSaleDetail" @keyup.esc="closeModalSaleDetail">
            <md-dialog-title>Detalhes da venda</md-dialog-title>

            <div class="content-modal product-list">
                <p class="sale-detail-info">Código da venda: <span>{{ selectSaleCode }}</span> - Total: <span>{{ selectSaleTotalValue | formatMoney }}</span></p>
                <table>
                    <thead>
                        <tr>
                            <th width="60%">Produto</th>
                            <th width="20%">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in this.selectSaleDetailProducts" :key="product.index">
                            <td>{{ product.name }}</td>
                            <td>{{ product.value | formatMoney }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeModalSaleDetail">Fechar</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<script src="./script.js"></script>
<style scoped src="./styles.css"></style>