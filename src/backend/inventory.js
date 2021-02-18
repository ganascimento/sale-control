import { findAllInventory, createInventory, updateInventory, getInventoryAlert, setInventoryAlert, getAlertProducts } from '@/database/db';
const { ipcMain } = require('electron');

ipcMain.on('get-all-inventory', (event) => {
    findAllInventory((err, result) => {
        event.reply('get-all-inventory', {
            result
        });
    });
});

ipcMain.on('insert-inventory', (event, inventory) => {
    createInventory(inventory, function(err) {
        let id = null;

        if (!err)
            id = this.lastID;

        event.reply('insert-inventory', {
            id
        });
    });
});

ipcMain.on('update-inventory', (event, inventory) => {
    updateInventory(inventory, function(err) {
        let status = false;

        if (!err)
            status = true;

        event.reply('update-inventory', {
            status
        });
    });
});

ipcMain.on('update-inventory-amount', (event, product) => {
    findAllInventory((err, result) => {
        let data = [];

        product.forEach(item => {
            if (data.filter(x => x.code === item.code).length > 0) {
                data = data.map(x => {
                    if (x.code === item.code) x.amount += item.amount;
                    return x;
                });
            }
            else {
                data.push({
                    code: item.code,
                    amount: item.amount
                });
            }
        });

        result.forEach(item => {
            data.forEach((prod, indexProd) => {
                if (item.productCode === prod.code) {
                    if (indexProd === data.length - 1) {
                        updateInventory({
                            code: item.code,
                            productCode: item.productCode,
                            amount: item.amount - prod.amount
                        }, () => {
                            event.reply('update-inventory-amount');
                        });
                    }
                    else {
                        updateInventory({
                            code: item.code,
                            productCode: item.productCode,
                            amount: item.amount - prod.amount
                        }, () => {});
                    }
                }
            });
        })
    });
});

ipcMain.on('get-inventory-alert', (event) => {
    getInventoryAlert((err, result) => {
        event.reply('get-inventory-alert', {
            result: result[0]
        });
    });
});

ipcMain.on('set-inventory-alert', (event, inventoryAlert) => {
    setInventoryAlert(inventoryAlert, function(err) {
        let status = false;

        if (!err)
            status = true;

        event.reply('set-inventory-alert', {
            status
        });
    });
});

ipcMain.on('get-alert-products', (event) => {
    getAlertProducts((err, result) => {
        event.reply('get-alert-products', {
            result
        });
    });
});