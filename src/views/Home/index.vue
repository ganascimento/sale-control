<template>
    <div class="content">
        <div class="body">
            <div @click="goMarket">
                <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                <p>Ponto de venda</p>
            </div>
            <div @click="goProduct">
                <i class="fa fa-list" aria-hidden="true"></i>
                <p>Cadastro de produto</p>
            </div>
            <div @click="goInventory">
                <i class="fa fa-box" aria-hidden="true"></i>
                <p>Estoque</p>
            </div>
            <div @click="goReport">
                <i class="fas fa-chart-bar"></i>
                <p>Relatórios</p>
            </div>
            <div @click="goConfiguration">
                <i class="fa fa-cog" aria-hidden="true"></i>
                <p>Configurações</p>
            </div>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style scoped src="./styles.css"></style>