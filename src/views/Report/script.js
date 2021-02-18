import Vue from 'vue';
import { ipcRenderer } from 'electron';
import BackArrow from '@/components/BackArrow.vue';
import { formatMoney, filterDayOfWeek, formatDate } from '@/common/filters.js';

const setDate = function(value) {
    if (value && this.startDate && this.endDate) {
        this.filter = {
            startDate: `${this.startDate.getFullYear()}-${this.startDate.getMonth() + 1}-${this.startDate.getDate()}`,
            endDate: `${this.endDate.getFullYear()}-${this.endDate.getMonth() + 1}-${this.endDate.getDate()}`
        };

        this.sendRequest(true);
    }
    else {
        this.filter = null;
        this.sendRequest(true);
    }
}

const sendRequest = function(value) {
    if (!value) return;

    if (this.reportType == 1)
        ipcRenderer.send('report-best-products', this.filter);
    else if (this.reportType == 2)
        ipcRenderer.send('report-best-days', this.filter);
    else if (this.reportType == 3)
        ipcRenderer.send('report-sale-by-day', this.filter);
}

const created = function() {
    ipcRenderer.on('report-best-products', (event, data) => {
        this.items = data.result;
    });

    ipcRenderer.on('report-best-days', (event, data) => {
        this.items = data.result;
    });

    ipcRenderer.on('report-sale-by-day', (event, data) => {
        this.items = data.result;
    });
}

export default Vue.extend({
    components: {
        BackArrow
    },
    data() {
        return {
            reportType: '',
            items: [],
            fullScreen: false,
            startDate: null,
            endDate: null,
            filter: null
        }
    },
    watch: {
        reportType(value) {
            this.sendRequest(value);
        },
        startDate(value) {
            this.setDate(value);
        },
        endDate(value) {            
            this.setDate(value);
        }
    },
    methods: {
        setDate,
        sendRequest
    },
    filters: {
        formatMoney,
        filterDayOfWeek,
        formatDate
    },
    created,
    destroyed() {
        ipcRenderer.removeAllListeners('report-best-products');
        ipcRenderer.removeAllListeners('report-best-days');
        ipcRenderer.removeAllListeners('report-sale-by-day');
    }
});