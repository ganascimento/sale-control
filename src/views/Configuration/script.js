import Vue from 'vue';
import { ipcRenderer } from 'electron';
import BackArrow from '@/components/BackArrow.vue';


const showCallbackInfo = function (status) {
    this.isLoading = false;

    if (status)
        this.$toasted.show('Ação realizada com sucesso', { type: 'success', position: 'top-center' });
    else
        this.$toasted.show('Ocorreu algum erro, verifique sua conexão', { type: 'error', position: 'top-center' });
}

const execBackup = function() {
    this.showDialogBackup = false;
    this.isLoading = true;
    ipcRenderer.send('backup-data');
}

const execRestore = function() {
    this.showDialogRestore = false;
    this.isLoading = true;
    ipcRenderer.send('restore-data');
}

const setBalanceConfiguration = function () {
    const data = {
        port: this.portConfig,
        baudRate: this.baudRateConfig
    };

    ipcRenderer.send('set-configuration', data);
    this.showDialogBalance = false;
}

const setInventoryConfiguration = function () {
    if (!this.minAmount || !this.minWeight) return;

    const data = {
        minAmount: this.minAmount,
        minWeight: this.minWeight
    };

    ipcRenderer.send('set-inventory-alert', data);
    this.showDialogInventoryConfig = false;
}

const created = function () {
    ipcRenderer.send('get-configuration');
    ipcRenderer.send('get-inventory-alert');

    ipcRenderer.on('backup-data', (event, data) => {
        this.showCallbackInfo(data.status);
    });

    ipcRenderer.on('restore-data', (event, data) => {
        this.showCallbackInfo(data.status);
    });

    ipcRenderer.on('get-configuration', (event, data) => {
        this.portConfig = data.result.port;
        this.baudRateConfig = data.result.baudRate;
    });

    ipcRenderer.on('set-configuration', (event, data) => {
        this.showCallbackInfo(data.status);
    });

    ipcRenderer.on('get-inventory-alert', (event, data) => {
        this.minAmount = data.result.minAmount;
        this.minWeight = data.result.minWeight;
    });

    ipcRenderer.on('set-inventory-alert', (event, data) => {
        this.showCallbackInfo(data.status);
    });
}

export default Vue.extend({
    components: {
        BackArrow
    },
    data() {
        return {
            isLoading: false,
            showDialogBackup: false,
            showDialogRestore: false,
            showDialogBalance: false,
            showDialogInventoryConfig: false,
            portConfig: 'COM1',
            baudRateConfig: 2400,
            minAmount: 0,
            minWeight: 0
        }
    },
    methods: {
        execBackup,
        execRestore,
        showCallbackInfo,
        setBalanceConfiguration,
        setInventoryConfiguration
    },
    created,
    destroyed() {
        ipcRenderer.removeAllListeners('backup-data');
        ipcRenderer.removeAllListeners('restore-data');
        ipcRenderer.removeAllListeners('get-configuration');
        ipcRenderer.removeAllListeners('set-configuration');
        ipcRenderer.removeAllListeners('get-inventory-alert');
        ipcRenderer.removeAllListeners('set-inventory-alert');
    }
});