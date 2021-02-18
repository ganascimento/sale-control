<template>
    <div class="content">
        <BackArrow title="Configurações" />
        <div class="body" v-show="!isLoading">
            <div @click="showDialogBackup = true">
                <i class="fas fa-database"></i>
                <p>Fazer backup</p>
            </div>
            <div @click="showDialogRestore = true">
                <i class="fas fa-undo"></i>
                <p>Restaurar dados</p>
            </div>
            <div @click="showDialogInventoryConfig = true">
                <i class="fas fa-boxes"></i>
                <p>Configurar estoque</p>
            </div>
            <div @click="showDialogBalance = true">
                <i class="fa fa-balance-scale" aria-hidden="true"></i>
                <p>Configurar balança</p>
            </div>
        </div>
        <div class="loading-content" v-show="isLoading">
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>

        <md-dialog :md-active.sync="showDialogBackup">
            <md-dialog-title>Atenção</md-dialog-title>

            <div class="content-modal">
                <p>
                    Esta ação irá substituir todos os dados que estão salvos no banco de dados online pelo dados que estão na
                    no sistema.
                </p>
                <p>
                    Tem certeza que quer realizar esta ação?
                </p>
            </div>

            <md-dialog-actions>
                <md-button class="md-primary" @click="showDialogBackup = false">Não</md-button>
                <md-button class="md-primary" @click="execBackup">Sim</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog :md-active.sync="showDialogRestore">
            <md-dialog-title>Atenção</md-dialog-title>

            <div class="content-modal">
                <p>
                    Esta ação irá remover todos os dados locais e será adicionado os dados que estão salvos no servidor.
                </p>
                <p>
                    Tem certeza que quer realizar esta ação?
                </p>
            </div>

            <md-dialog-actions>
                <md-button class="md-primary" @click="showDialogRestore = false">Não</md-button>
                <md-button class="md-primary" @click="execRestore">Sim</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog :md-active.sync="showDialogInventoryConfig">
            <md-dialog-title>Configurações dos valores minimos</md-dialog-title>

            <div class="content-modal-inventory">
                <div class="form-config">
                    <label for="minAmount">Quantidade minima:</label>
                    <input type="number" id="minAmount" v-model="minAmount" />
                </div>

                <div class="form-config">
                    <label for="minWeight">Peso minimo:</label>
                    <input type="number" id="minWeight" v-model="minWeight" />
                </div>
            </div>

            <md-dialog-actions>
                <md-button class="md-primary" @click="showDialogInventoryConfig = false">Sair</md-button>
                <md-button class="md-primary" @click="setInventoryConfiguration">Confirmar</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog :md-active.sync="showDialogBalance">
            <md-dialog-title>Configurações da balança</md-dialog-title>

            <div class="content-modal-balance">
                <div class="form-config">
                    <label for="portConfig">Porta serial</label>
                    <select id="portConfig" v-model="portConfig">
                        <option value="COM1">COM1</option>
                        <option value="COM2">COM2</option>
                        <option value="COM3">COM3</option>
                        <option value="COM4">COM4</option>
                        <option value="COM5">COM5</option>
                    </select>
                </div>

                <div class="form-config">
                    <label for="baudRateConfig">Velocidade</label>
                    <select id="baudRateConfig" v-model="baudRateConfig">
                        <option value="2400">2400</option>
                        <option value="4800">4800</option>
                        <option value="9600">9600</option>
                    </select>
                </div>
            </div>

            <md-dialog-actions>
                <md-button class="md-primary" @click="showDialogBalance = false">Sair</md-button>
                <md-button class="md-primary" @click="setBalanceConfiguration">Confirmar</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<script src="./script.js"></script>
<style scoped src="./styles.css"></style>