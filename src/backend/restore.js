const { ipcMain } = require('electron');
import { restoreAllProducts, restoreAllSales, restoreAllProductSales, clearTables, restoreAllInventory } from '@/database/db';
import { connect, ProductModel, SaleModel, ProductSaleModel, InventoryModel } from './mongoData';

let ipcEvent;

ipcMain.on('restore-data', async (event) => {
    ipcEvent = event;

    if (await connect() === false)
        returnInfo(false);
    else {
        clearTables((err) => {
            if (err)
                returnInfo(false);
            else
                restoreProduct();
        });
    }
});

const restoreProduct = async () => {
    try {
        var data = await ProductModel.find();
        if (!data || data.length === 0) throw false;
        
        restoreAllProducts(data, (err) => {
            if (err)
                returnInfo(false);
            else
                restoreSale();
        });
    }
    catch {
        returnInfo(false);
    }
}

const restoreSale = async () => {
    try {
        var data = await SaleModel.find();
        if (!data || data.length === 0) throw false;
        
        restoreAllSales(data, (err) => {
            if (err)
                returnInfo(false);
            else
                restoreProductSale();
        });
    }
    catch {
        returnInfo(false);
    }
}

const restoreProductSale = async () => {
    try {
        var data = await ProductSaleModel.find();
        if (!data || data.length === 0) throw false;
        
        restoreAllProductSales(data, (err) => {
            if (err)
                returnInfo(false);
            else
                restoreInventory();
        });
    }
    catch {
        returnInfo(false);
    }
}

const restoreInventory = async () => {
    try {
        var data = await InventoryModel.find();

        if (!data || data.length === 0) throw false;
        
        restoreAllInventory(data, (err) => {
            if (err)
                returnInfo(false);
            else
                returnInfo(true);
        });
    }
    catch {
        returnInfo(false);
    }
}

const returnInfo = (status) => {
    ipcEvent.reply('backup-data', {
        status
    });
}