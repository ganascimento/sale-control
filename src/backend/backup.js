const { ipcMain } = require('electron');
import { findAllProductBackup, findAllSaleBackup, findAllProductSaleBackup, findAllInventoryBackup } from '@/database/db';
import { connect, ProductModel, SaleModel, ProductSaleModel, InventoryModel } from './mongoData';

let ipcEvent;

ipcMain.on('backup-data', async (event) => {
    ipcEvent = event;

    if (await connect() === false)
        returnInfo(false);
    else
        backupProduct();
});

const backupProduct = () => {
    findAllProductBackup(async (err, result) => {
        try {
            let status = true;
            if (err || !result || result.length === 0) throw false;

            await ProductModel.collection.deleteMany({});
            ProductModel.insertMany(result).catch(() => status = false);

            if (!status)
                returnInfo(false);
            else
                backupSale();
        }
        catch {
            returnInfo(false);
        }
    });
}

const backupSale = () => {
    findAllSaleBackup(async (err, result) => {
        try {
            let status = true;
            if (err || !result || result.length === 0) throw false;

            await SaleModel.collection.deleteMany({});
            SaleModel.insertMany(result).catch(() => status = false);

            if (!status)
                returnInfo(false);
            else
                backupProductSale();
        }
        catch {
            returnInfo(false);
        }
    });
}

const backupProductSale = () => {
    findAllProductSaleBackup(async (err, result) => {
        try {
            let status = true;
            if (err || !result || result.length === 0) throw false;

            await ProductSaleModel.collection.deleteMany({});
            ProductSaleModel.insertMany(result).catch(() => status = false);

            if (!status)
                returnInfo(false);
            else
                backupInventory()
        }
        catch {
            returnInfo(false);
        }
        
    });
}

const backupInventory = () => {
    findAllInventoryBackup(async (err, result) => {
        try {
            let status = true;

            if (err || !result || result.length === 0) throw false;
    
            await InventoryModel.collection.deleteMany({});
            InventoryModel.insertMany(result).catch(() => status = false);
    
            returnInfo(status);
        }
        catch {
            returnInfo(false);
        }
    });
}

const returnInfo = (status) => {
    ipcEvent.reply('backup-data', {
        status
    });
}