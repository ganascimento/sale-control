import Vue from 'vue';
import { ipcRenderer } from 'electron';
import BackArrow from '@/components/BackArrow.vue';

const clearScreen = function () {
    this.product = { type: '', amount: 0 };
    this.selectedRowCode = null;
    this.valid = {};
    this.fullScreen = false;
}

const validation = function() {
    if (!this.product.code)
        return;

    let valid = true;

    if (this.product.amount <= 0) {
        valid = false
        this.valid.amount =  'O estoque deve ser maior ou igual a 0';
    }

    if (valid)
        this.updateInventory();
}

const updateInventory = function() {
    const data = {
        code: this.product.code,
        productCode: this.product.productCode,
        amount: this.product.type === 2 ? parseInt(this.product.amount) : this.product.amount
    };

    ipcRenderer.send('update-inventory', data);
}

const getTypeByCode = function (type) {
    return type === 1 ? 'A granel' : 'Unitário';
}

const amountFormat = function (value, type) {
    if (type === 2)
        return value;
    else if (type === 1)
        return `${parseFloat(value).toFixed(3).replace('.', ',')}`;
}

const measureFormat = function(type) {
    if (type === 2)
        return 'unidade';
    else if (type === 1)
        return 'KG';
}

const selectRow = function (code) {
    this.selectedRowCode = code;

    this.product = this.items.filter(item => {
        if (item.code === code) {
            if (item.type === 1)
                item.amount = item.amount.toFixed(3);

            return item;
        }
    })[0];
}

const screenFuncions = function(event) {
    if (event.keyCode === 27)
        this.clearScreen();
    else if (event.keyCode === 119)
        this.validation();
}

const showCallbackInfo = function (status) {
    if (status)
        this.$toasted.show('Ação realizada com sucesso', { type: 'success', position: 'top-center' });
    else
        this.$toasted.show('Ocorreu algum erro, verifique sua conexão', { type: 'error', position: 'top-center' });
}

const classConstruct = function (code, productCode) {
    let classData = '';

    if (this.selectedRowCode === code)
        classData += 'select-row';
    if (this.productsAlert.filter(x => x.productCode === productCode).length > 0) 
        classData += ' min-value'

    return classData;
}

const created = function() {
    ipcRenderer.send('get-all-inventory');

    ipcRenderer.on('get-all-inventory', (event, data) => {
        this.items = data.result;
    });

    ipcRenderer.on('update-inventory', (event, data) => {
        this.showCallbackInfo(data.status);
        this.clearScreen();
        ipcRenderer.send('get-alert-products');
    });

    ipcRenderer.send('get-alert-products');

    ipcRenderer.on('get-alert-products', (event, data) => {
        this.productsAlert = data.result;
    });
}

export default Vue.extend({
    components: {
        BackArrow
    },
    data() {
        return {
            product: {
                code: 0,
                productCode: 0,
                name: '',
                type: null,
                amount: 0
            },
            valid: {
                amount: ''
            },
            items: [],
            selectedRowCode: null,
            fullScreen: false,
            productsAlert: []
        }
    },
    methods: {
        clearScreen,
        validation,
        getTypeByCode,
        selectRow,
        screenFuncions,
        showCallbackInfo,
        updateInventory,
        amountFormat,
        measureFormat,
        classConstruct
    },
    created,
    destroyed() {
        ipcRenderer.removeAllListeners('get-all-inventory');
        ipcRenderer.removeAllListeners('update-inventory');
        ipcRenderer.removeAllListeners('get-alert-products');
    }
});