import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home/index.vue';
import Market from '@/views/Market/index.vue';
import Product from '@/views/Product/index.vue';
import Inventory from '@/views/Inventory/index.vue';
import Report from '@/views/Report/index.vue';
import Configuration from '@/views/Configuration/index.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/Market',
        name: 'Market',
        component: Market
    },
    {
        path: '/Product',
        name: 'Product',
        component: Product
    },
    {
        path: '/Report',
        name: 'Report',
        component: Report
    },
    {
        path: '/Configuration',
        name: 'Configuration',
        component: Configuration
    },
    {
        path: '/Inventory',
        name: 'Inventory',
        component: Inventory
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
