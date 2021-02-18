import Vue from 'vue';
import { ipcRenderer } from 'electron';
import { formatMoney } from '@/common/filters.js';
import BackArrow from '@/components/BackArrow.vue';

const validation = function() {
    let valid = true;
    this.valid = {};

    if (!this.editManyItems) {
        if (!this.product.name || !this.product.value || !this.product.keyCode) {
            this.valid.name = this.product.name ? '' : 'Informe um nome para o produto';
            this.valid.value = this.product.value ? '' : 'Informe um valor para o produto';
            this.valid.keyCode = this.product.keyCode ? '' : 'Informe um chave para identificar o produto';
            valid = false;
        }
        else if (this.selectedRowCode === null && this.items.filter(item => item.keyCode === this.product.keyCode).length > 0) {
            this.valid.keyCode = 'Já existe uma chave com este valor cadastrada';
            valid = false;
        }
        else if (this.selectedRowCode === null && this.items.filter(item => item.name.toUpperCase() === this.product.name.toUpperCase() && item.type === this.product.type).length > 0) {
            this.valid.name = 'Já existe um produto cadastrado com este nome e este tipo';
            valid = false;
        }
        else if (this.selectedRowCode && this.selectedRowCode > 0 && this.items.filter(item => item.keyCode === this.product.keyCode && item.code !== this.product.code).length > 0) {
            this.valid.keyCode = 'Já existe uma chave com este valor cadastrada';
            valid = false;
        }
    
        if (valid && this.selectedRowCode === null)
            this.createProduct();
        else if (valid && this.selectedRowCode && this.selectedRowCode > 0)
            this.updateProduct();
    }
    else {
        if (!this.product.value) {
            this.valid.value = this.product.value ? '' : 'Informe um valor para os produtos';
            valid = false;
        }
        else if (this.selectedProducts.length === 0) {
            this.valid.value = 'Selecione pelo menos um produto';
            valid = false;
        }

        this.updateProductValue();
    }
}

const getTypeByCode = function (type) {
    return type === 1 ? 'A granel' : 'Unitário';
}

const selectRow = function (code) {
    if (!this.editManyItems) {
        this.selectedRowCode = code;
        this.product = this.items.filter(item => item.code === code)[0];
        this.$refs.name.focus();
    }
    else {
        if (this.selectedProducts.indexOf(code) >= 0) {
            const index = this.selectedProducts.indexOf(code);
            this.selectedProducts.splice(index, 1);
        }
        else
            this.selectedProducts.push(code);
    }
}

const screenFuncions = function(event) {
    if (event.keyCode === 27)
        this.clearScreen();
    else if (event.keyCode === 119)
        this.validation();
    else if (event.keyCode === 117)
        this.removeProduct();
}

const clearScreen = function () {
    this.product = { type: 2 };
    this.selectedRowCode = null;
    this.$refs.name.focus();
    this.editManyItems = false;
    this.selectAll = false;
    this.valid = {};
    this.selectedProducts = [];
}

const handleEditManyItems = function() {
    const status = !this.editManyItems;
    this.clearScreen();
    this.editManyItems = status;
}

const createProduct = function () {
    ipcRenderer.send('insert-product', this.product);
}

const createInventory = function(data) {
    ipcRenderer.send('insert-inventory', data);
}

const updateProduct = function () {
    ipcRenderer.send('update-product', this.product);
}

const updateProductValue = function () {
    var data = {
        codes: this.selectedProducts,
        value: this.product.value,
        type: this.product.type        
    };

    ipcRenderer.send('update-product-value', data);
}

const removeProduct = function () {
    ipcRenderer.send('remove-product', this.product.code);
}

const created = function() {
    ipcRenderer.send('get-all-products');

    ipcRenderer.on('get-all-products', (event, data) => {
        this.items = data.result;
    });

    ipcRenderer.on('insert-product', (event, data) => {
        if (data.id && data.id > 0) {
            this.product.code = data.id;
            this.items.push(this.product);

            this.createInventory({
                productCode: data.id,
                amount: 0
            });
        }

        this.clearScreen();
    });

    ipcRenderer.on('update-product', (event, data) => {
        if (data.status === true) {
            this.items = this.items.map(item => {
                if (item.code === this.product.code) {
                    item.name = this.product.name;
                    item.value = this.product.value;
                    item.type = this.product.type;
                    item.keyCode = this.product.keyCode;
                }

                return item;
            });
        }
        
        this.clearScreen();
    });

    ipcRenderer.on('update-product-value', (event, data) => {
        if (data.status === true) {
            this.items = this.items.map(item => {
                if (this.selectedProducts.indexOf(item.code) >= 0) {
                    item.value = this.product.value;
                    item.type = this.product.type;
                }

                return item;
            });
        }
        
        this.clearScreen();
    });

    ipcRenderer.on('remove-product', (event, data) => {
        if (data.status === true) {
            this.items = this.items.filter(item => item.code !== this.product.code);
        }

        this.clearScreen();
    });
}

export default Vue.extend({      
    components: {
        BackArrow
    },  
    data() {
        return {
            items: [],
            product: {
                code: null,
                name: '',
                value: '',
                type: 2,
                keyCode: ''
            },
            valid: {
                name: '',
                value: '',
                keyCode: ''
            },
            selectedProducts: [],
            selectedRowCode: null,
            fullScreen: false,
            selectAll: false,
            editManyItems: false
        }
    },
    methods: {
        validation,
        getTypeByCode,
        selectRow,
        clearScreen,
        handleEditManyItems,
        createProduct,
        createInventory,
        updateProduct,
        updateProductValue,
        removeProduct,
        screenFuncions
    },
    watch: {
        selectAll(checked) {
            if (checked)
                this.selectedProducts = this.items.map(item => item.code);
            else
                this.selectedProducts = [];
        }
    },
    filters: {
        formatMoney
    },
    created,
    destroyed() {
        ipcRenderer.removeAllListeners('get-all-products');
        ipcRenderer.removeAllListeners('insert-product');
        ipcRenderer.removeAllListeners('update-product');
        ipcRenderer.removeAllListeners('update-product-value');
        ipcRenderer.removeAllListeners('remove-product');
    }
});