import Vue from 'vue';
import { ipcRenderer } from 'electron';
import { formatMoney, formatWeight } from '@/common/filters.js';
import { PRODUCT_TYPE } from '../../common/costants.js';
import BackArrow from '@/components/BackArrow.vue';

const addItem = function () {
    if (this.amountItens == 0) {
        this.inputValue = '';
        return;
    }

    var item = this.products.filter(product => product.keyCode === this.inputValue)[0];

    if (item) {
        let total = item.value;
        let amount = parseInt(this.amountItens);

        if (item.type === PRODUCT_TYPE.Granel) {
            if (this.weight === '0') return;
            total = item.value * parseFloat(this.weight);
            amount = parseFloat(this.weight);
        }
        else if (item.type === PRODUCT_TYPE.Unitario) {
            total = item.value * amount;
        }

        this.items.unshift({
            number: this.index,
            code: item.code,
            name: item.name,
            value: item.value,
            amount: amount,
            type: item.type,
            total
        });
        
        this.index++;
        this.amountItens = 1;
    }
    this.inputValue = '';
}

const clearScreen = function() {
    this.items = [];
    this.index = 1;
    this.inputValue = '';
    this.amountItens = 1;
    this.weight = '0';
    this.$refs.product.focus();
    this.selectedRowNumber = null;
}

const formatByType = function (value, type) {
    if (type === 1) value = value.toFixed(3).toString();
    return value;
}

const screenFuncions = function(event) {
    if (event.keyCode === 119) {
        this.finishSale();
    }
    else if (event.keyCode === 27) {
        this.clearScreen();        
    }
    else if (event.keyCode === 117) {
        this.removeProduct();
    }
    else if (event.keyCode === 112) {
        this.showDialogProduct = true;
    }
    else if (event.keyCode === 113) {
        this.showDialogAmount = true;
        setTimeout(() => {
            this.amountItens = '';
            this.$refs.amountInput.focus();
        }, 300);
    }
    else if (event.keyCode === 114) {
        this.showDialogSellsHistory = true;
    }
}

const selectRow = function (number) {
    if (this.selectedRowNumber && this.selectedRowNumber > 0 && this.selectedRowNumber === number)
        this.selectedRowNumber = null;
    else
        this.selectedRowNumber = number;

    this.$refs.product.focus();
}

const removeProduct = function() {
    this.items = this.items.filter(item => {
        if (item.number !== this.selectedRowNumber)
            return item;
    });

    this.index = this.items.length;
    var number = this.index;

    this.items = this.items.map(item => {
        item.number = number;
        number--;
        return item;
    });

    this.index++;
    this.$refs.product.focus();
    this.selectedRowNumber = null;
}

const finishSale = function() {
    if (this.items.length === 0) return;

    const productSale = [];

    this.items.forEach(item => {
        productSale.push({
            productCode: item.code,
            value: item.total
        });
    });

    ipcRenderer.send('insert-sale', productSale);
}

const closeModal = function() {
    this.showDialogProduct = false;
    this.$refs.product.focus();
}

const closeModalSellsHistory = function() {
    this.showDialogSellsHistory = false;
    this.$refs.product.focus();
}

const closeModalSaleDetail = function() {
    this.showDialogSaleDetail = false;
    this.selectSaleCode = 0,
    this.selectSaleTotalValue = 0;
    this.selectSaleDetailProducts = [];
}

const setValueAmount = function() {
    if (this.amountItens == 0)
        this.amountItens = 1;

    this.showDialogAmount = false;
    this.$refs.product.focus();
}

const resetValueAmount = function() {
    this.amountItens = 1;
    this.$refs.product.focus();
}

const rowTableSaleClick = function(sale) {
    this.showDialogSaleDetail = true;
    this.selectSaleCode = sale.code;
    this.selectSaleTotalValue = sale.value;

    ipcRenderer.send('get-product-sale-by-code', sale.code);
}

const created = function() {
    ipcRenderer.send('get-weight-from-scale');

    ipcRenderer.send('get-all-sales');

    ipcRenderer.on('get-weight-from-scale', (event, resp) => {
        this.weight = resp.weight;
        clearInterval(this.interval);

        console.log(this.weight)

        this.interval = setInterval(() => {
            this.weight = '0';
            clearInterval(this.interval);
        }, 1000);
    });

    ipcRenderer.send('get-all-products');

    ipcRenderer.on('get-all-products', (event, data) => {
        this.products = data.result;
    });

    ipcRenderer.on('insert-sale', (event, data) => {
        if (data.status){
            this.$toasted.show('Venda registrada', { type: 'success', position: 'top-center' });

            const data = [];

            this.items.forEach(item => {
                data.push({
                    code: item.code,
                    amount: item.amount
                });
            });
            
            ipcRenderer.send('update-inventory-amount', data);

            this.clearScreen();
        }
        else
            this.$toasted.show('Ocorreu algum erro ao registrar a venda', { type: 'error', position: 'top-center' });
    });

    ipcRenderer.on('update-inventory-amount', () => {
        ipcRenderer.send('get-alert-products');
    });

    ipcRenderer.send('get-alert-products');

    ipcRenderer.on('get-alert-products', (event, data) => {
        this.productsAlert.splice(0, this.productsAlert.length);
        
        data.result.forEach(item => {
            this.productsAlert.push(item);
        })
    });

    ipcRenderer.on('get-all-sales', (event, data) => {
        let sales = [];

        if (data.result && data.result.length > 0) {
            let currentDate = new Date().setHours(0,0,0,0);

            data.result.forEach(item => {
                let compareDate = Date.parse(item.date);
                
                if (currentDate === compareDate) {
                    sales.push(item);
                }
            });
        }

        sales = sales.reverse();

        this.sales = sales;
    });

    ipcRenderer.on('get-product-sale-by-code', (event, data) => {
        let index = 0;

        data.result = data.result.map(item => {
            item.index = index;
            index++;
            return item;
        });

        this.selectSaleDetailProducts = data.result;
    });
}

export default Vue.extend({
    components: {
        BackArrow
    },
    data() {
        return {
            inputValue: '',
            weight: '0',
            index: 1,
            items: [],
            products: [],
            selectedRowNumber: null,
            interval: null,
            productsAlert: [],
            showDialogProduct: false,
            showDialogAmount: false,
            showDialogSellsHistory: false,
            showDialogSaleDetail: false,
            amountItens: 1,
            sales: [],
            selectSaleCode: 0,
            selectSaleTotalValue: 0,
            selectSaleDetailProducts: []
        }
    },
    computed: {
        formatTotal() {
            const total = this.items.map(item => item.total).reduce((total, current) => total + current, 0);

            return `R$ ${parseFloat(total).toFixed(2).replace('.', ',')}`;
        },
        getQuantity() {
            return this.items.length;
        }
    },
    methods: {
        addItem,
        clearScreen,
        screenFuncions,
        finishSale,
        formatByType,
        selectRow,
        removeProduct,
        closeModal,
        closeModalSellsHistory,
        closeModalSaleDetail,
        setValueAmount,
        resetValueAmount,
        rowTableSaleClick
    },
    filters: {
        formatMoney,
        formatWeight
    },
    created,
    destroyed() {
        ipcRenderer.removeAllListeners('get-weight-from-scale');
        ipcRenderer.removeAllListeners('get-all-products');
        ipcRenderer.removeAllListeners('insert-sale');
        ipcRenderer.removeAllListeners('get-alert-products');
        ipcRenderer.removeAllListeners('update-inventory-amount');
        ipcRenderer.removeAllListeners('get-all-sales');
        ipcRenderer.removeAllListeners('get-product-sale-by-code');
    }
});