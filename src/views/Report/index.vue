<template>
    <div class="content">
        <BackArrow title="Relatórios" v-show="!fullScreen"/>
        <div class="select-content" v-show="!fullScreen">
            <select v-model="reportType">
                <option value="">Selecione ...</option>
                <option value="1">Produto mais vendido</option>
                <option value="2">Dia da semana com maior venda</option>
                <option value="3">Vendas por dia</option>
            </select>
            <md-datepicker class="datepicker" v-model="startDate">
                <label>Data inicial</label>
            </md-datepicker>
            <md-datepicker class="datepicker" v-model="endDate">
                <label>Data final</label>
            </md-datepicker>
        </div>
        <div class="table-content" v-if="reportType == 1" :class="fullScreen ? 'fullscreen' : ''">
            <div class="table-functions">
                <button @click="fullScreen = !fullScreen"><i class="fas" :class="fullScreen ? 'fa-compress-arrows-alt' : 'fa-expand-arrows-alt'"></i></button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th width="50%">Nome do produto</th>
                        <th width="25%">Quantidade vendida</th>
                        <th width="25%">Valor total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.amount }}</td>
                        <td>{{ item.value | formatMoney }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-content" v-else-if="reportType == 2" :class="fullScreen ? 'fullscreen' : ''">
            <div class="table-functions">
                <button @click="fullScreen = !fullScreen"><i class="fas" :class="fullScreen ? 'fa-compress-arrows-alt' : 'fa-expand-arrows-alt'"></i></button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th width="60%">Dia da semana</th>
                        <th width="40%">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.name">
                        <td>{{ item.dayOfWeek | filterDayOfWeek }}</td>
                        <td>{{ item.total | formatMoney }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-content" v-else-if="reportType == 3" :class="fullScreen ? 'fullscreen' : ''">
            <div class="table-functions">
                <button @click="fullScreen = !fullScreen"><i class="fas" :class="fullScreen ? 'fa-compress-arrows-alt' : 'fa-expand-arrows-alt'"></i></button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th width="60%">Data</th>
                        <th width="40%">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.name">
                        <td>{{ item.date | formatDate }}</td>
                        <td>{{ item.total | formatMoney }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-content-clean" v-else></div>
    </div>
</template>

<script src="./script.js"></script>
<style scoped src="./styles.css"></style>