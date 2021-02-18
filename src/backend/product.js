import { findAllProducts, createProduct, updateProduct, removeProduct, updateProductValue } from '@/database/db';
const { ipcMain } = require('electron');

ipcMain.on('get-all-products', (event) => {
    findAllProducts((err, result) => {
        event.reply('get-all-products', {
            result
        });
    });
});

ipcMain.on('insert-product', (event, product) => {
    createProduct(product, function(err) {
        let id = null;

        if (!err)
            id = this.lastID;

        event.reply('insert-product', {
            id
        });
    });
});

ipcMain.on('update-product', (event, product) => {
    updateProduct(product, function(err) {
        let status = false;

        if (!err)
            status = true;

        event.reply('update-product', {
            status
        });
    });
});

ipcMain.on('update-product-value', (event, code) => {
    updateProductValue(code, function(err) {
        let status = false;

        if (!err)
            status = true;

        event.reply('update-product-value', {
            status
        });
    });
});

ipcMain.on('remove-product', (event, code) => {
    removeProduct(code, function(err) {
        let status = false;

        if (!err)
            status = true;

        event.reply('remove-product', {
            status
        });
    });
});