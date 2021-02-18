import { createSale, addProductSale, reportBestProduct, reportBestDay, reportSaleByDay, getAllSales, getProductSaleByCode } from '@/database/db';
const { ipcMain } = require('electron');

ipcMain.on('insert-sale', (event, productSale) => {
    const date = new Date();
    
    const sale = {
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        dayOfWeek: new Date().getDay()
    };

    createSale(sale, function(err) {
        if (!err) {
            addProductSale(this.lastID, productSale, function(err){
                let status = false;

                if (!err)
                    status = true;

                event.reply('insert-sale', {
                    status
                });
            });
        }
        else {
            event.reply('insert-sale', {
                status: false
            });
        }
    });
});

ipcMain.on('get-all-sales', (event) => {
    getAllSales((err, result) => {
        event.reply('get-all-sales', {
            result
        })
    });
});

ipcMain.on('get-product-sale-by-code', (event, code) => {
    getProductSaleByCode(code, (err, result) => {
        event.reply('get-product-sale-by-code', {
            result
        });
    });
})

ipcMain.on('report-best-products', (event, filter) => {
    reportBestProduct(filter, (err, result) => {
        event.reply('report-best-products', {
            result
        });
    });
});

ipcMain.on('report-best-days', (event, filter) => {
    reportBestDay(filter, (err, result) => {        
        event.reply('report-best-days', {
            result
        });
    });
});

ipcMain.on('report-sale-by-day', (event, filter) => {
    reportSaleByDay(filter, (err, result) => {        
        event.reply('report-best-days', {
            result
        });
    });
});