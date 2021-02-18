var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');

const createTables = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS TB_PRODUCTS (
            code INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            value REAL NOT NULL,
            type INTEGER NOT NULL,
            keyCode TEXT NOT NULL,
            isRemoved INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS TB_SALES (
            code INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            dayOfWeek INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS TB_PRODUCT_SALES (
            saleCode INTEGER NOT NULL,
            productCode INTEGER NOT NULL,
            value REAL NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS TB_CONFIG (
            port TEXT NOT NULL,
            baudRate INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS TB_INVENTORY (
            code INTEGER PRIMARY KEY AUTOINCREMENT,
            productCode INTEGER NOT NULL,
            amount INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS TB_INVENTORY_ALERT (
            minAmount INTEGER NOT NULL,
            minWeight INTEGER NOT NULL
        )
    `);
};

const getConfiguration = (callback) => {
    db.all(`
        SELECT  *
        FROM    TB_CONFIG
    `, callback);
}

const setConfiguration = (data, callback) => {
    db.run('DELETE  FROM TB_CONFIG');
    
    db.run(`
        INSERT  INTO TB_CONFIG (port, baudRate)
        VALUES  ("${data.port}", ${data.baudRate})
    `, callback);
}

const findAllProducts = (callback) => {
    db.all(`
        SELECT  * 
        FROM    TB_PRODUCTS
        WHERE   isRemoved = 0`, 
        callback);
};

const createProduct = (product, callback) => {
    db.run(`
        INSERT  INTO TB_PRODUCTS (name, value, type, keyCode, isRemoved) 
        VALUES  ("${product.name}", ${product.value}, ${product.type}, "${product.keyCode}", 0)`, 
        callback);
};

const updateProduct = (product, callback) => {
    db.run(`
        UPDATE  TB_PRODUCTS
        SET     name = "${product.name}",
                value = ${product.value},
                type = ${product.type},
                keyCode = "${product.keyCode}"
        WHERE   code = ${product.code}
    `, callback);
}

const updateProductValue = (data, callback) => {
    db.run(`
        UPDATE  TB_PRODUCTS
        SET     value = ${data.value},
                type = ${data.type}
        WHERE   code IN (${data.codes.join(',')})
    `, callback);
};

const removeProduct = (code, callback) => {
    db.run(`
        UPDATE  TB_PRODUCTS
        SET     isRemoved = 1
        WHERE   code = ${code}
    `, callback);
}

const findAllInventory = (callback) => {
    db.all(`
        SELECT  INVENTORY.code,
                PRODUCTS.code AS productCode,
                INVENTORY.amount,
                PRODUCTS.name,
                PRODUCTS.type
        FROM    TB_INVENTORY INVENTORY
        INNER   JOIN TB_PRODUCTS PRODUCTS
        ON      INVENTORY.productCode = PRODUCTS.code
    `, callback);
    //WHERE   PRODUCTS.isRemoved = 0
}

const createInventory = (inventory, callback) => {
    db.run(`
        INSERT  INTO TB_INVENTORY (productCode, amount)
        VALUES  (${inventory.productCode}, ${inventory.amount})
    `, callback);
}

const updateInventory = (inventory, callback) => {
    db.run(`
        UPDATE  TB_INVENTORY
        SET     productCode = ${inventory.productCode},
                amount = ${inventory.amount}
        WHERE   code = ${inventory.code}
    `, callback);
}

const createSale = (sale, callback) => {
    db.run(`
        INSERT  INTO TB_SALES (date, dayOfWeek)
        VALUES  ("${sale.date}", ${sale.dayOfWeek})
    `, callback);
};

const addProductSale = (saleCode, producstSale, callback) => {
    let query = 'INSERT  INTO TB_PRODUCT_SALES (saleCode, productCode, value) VALUES ';

    producstSale.forEach(item => {
        query += `(${saleCode}, ${item.productCode}, ${item.value}),`;
    });

    query = query.substring(0, query.length - 1) + ';';
    db.run(query, callback);
}

const getAllSales = (callback) => {
    let query = `
        SELECT  SALES.code,
                SALES.date,
                SUM(PRODUCT_SALES.value) as value
        FROM    TB_SALES SALES
        INNER   JOIN TB_PRODUCT_SALES PRODUCT_SALES
        ON      SALES.code = PRODUCT_SALES.saleCode
        GROUP   BY  SALES.code,
                    SALES.date
    `;

    db.all(query, callback);
}

const getProductSaleByCode = (code, callback) => {
    let query = `
        SELECT  PRODUCT_SALES.saleCode,
                PRODUCTS.name,
                PRODUCT_SALES.value
        FROM    TB_PRODUCT_SALES PRODUCT_SALES
        INNER   JOIN TB_PRODUCTS PRODUCTS
        ON      PRODUCT_SALES.productCode = PRODUCTS.code
        WHERE   PRODUCT_SALES.saleCode = ${code}
    `;

    db.all(query, callback);
}

const reportBestProduct = (filter, callback) => {
    let query;

    if (filter && filter.startDate && filter.endDate) {
        query = `
            SELECT  PRODUCTS.name,
                    COUNT(PRODUCTS.code) AS amount,
                    SUM(PRODUCT_SALES.value) AS value
            FROM    TB_PRODUCT_SALES PRODUCT_SALES
            INNER   JOIN TB_PRODUCTS PRODUCTS
            ON      PRODUCT_SALES.productCode = PRODUCTS.code
            INNER   JOIN TB_SALES SALES
            ON      PRODUCT_SALES.saleCode = SALES.code
            WHERE   SALES.date BETWEEN "${filter.startDate}" AND "${filter.endDate}"
            GROUP   BY PRODUCTS.name
            ORDER   BY amount DESC
        `;
    }
    else {
        query = `
            SELECT  PRODUCTS.name,
                    COUNT(PRODUCTS.code) AS amount,
                    SUM(PRODUCT_SALES.value) AS value
            FROM    TB_PRODUCT_SALES PRODUCT_SALES
            INNER   JOIN TB_PRODUCTS PRODUCTS
            ON      PRODUCT_SALES.productCode = PRODUCTS.code
            GROUP   BY PRODUCTS.name
            ORDER   BY amount DESC
        `;
    }

    db.all(query, callback);
}

const reportBestDay = (filter, callback) => {
    let query;

    if (filter && filter.startDate && filter.endDate) {
        query = `
            SELECT  SALES.dayOfWeek,
                    COUNT(PRODUCT_SALES.value) AS total
            FROM    TB_SALES SALES
            INNER   JOIN TB_PRODUCT_SALES PRODUCT_SALES
            ON      SALES.code = PRODUCT_SALES.saleCode
            WHERE   SALES.date BETWEEN "${filter.startDate}" AND "${filter.endDate}"
            GROUP   BY SALES.dayOfWeek
            ORDER   BY total DESC
        `;
    }
    else {
        query = `
            SELECT  SALES.dayOfWeek,
                    COUNT(PRODUCT_SALES.value) AS total
            FROM    TB_SALES SALES
            INNER   JOIN TB_PRODUCT_SALES PRODUCT_SALES
            ON      SALES.code = PRODUCT_SALES.saleCode
            GROUP   BY SALES.dayOfWeek
            ORDER   BY total DESC
        `;
    }

    db.all(query, callback);
}

const reportSaleByDay = (filter, callback) => {
    let query;

    if (filter && filter.startDate && filter.endDate) {
        query = `
            SELECT  SUM(PRODUCT_SALES.value) AS total,
                    SALES.date
            FROM    TB_SALES SALES
            INNER   JOIN TB_PRODUCT_SALES PRODUCT_SALES
            ON      SALES.code = PRODUCT_SALES.saleCode
            WHERE   SALES.date BETWEEN "${filter.startDate}" AND "${filter.endDate}"
            GROUP   BY SALES.date
            ORDER   BY SALES.date DESC
        `;
    }
    else {
        query = `
            SELECT  SUM(PRODUCT_SALES.value) AS total,
                    SALES.date
            FROM    TB_SALES SALES
            INNER   JOIN TB_PRODUCT_SALES PRODUCT_SALES
            ON      SALES.code = PRODUCT_SALES.saleCode
            GROUP   BY SALES.date
            ORDER   BY SALES.date DESC
        `;
    }

    db.all(query, callback);
}

const findAllProductBackup = (callback) => {
    db.all(`
        SELECT  *
        FROM    TB_PRODUCTS
    `, callback);
}

const findAllSaleBackup = (callback) => {
    db.all(`
        SELECT  *
        FROM    TB_SALES
    `, callback);
}

const findAllProductSaleBackup = (callback) => {
    db.all(`
        SELECT  *
        FROM    TB_PRODUCT_SALES
    `, callback);
}

const findAllInventoryBackup = (callback) => {
    db.all(`
        SELECT  *
        FROM    TB_INVENTORY
    `, callback);
}

const clearTables = (callback) => {
    db.run('DELETE FROM TB_PRODUCTS;');
    db.run('DELETE FROM TB_SALES;');
    db.run('DELETE FROM TB_INVENTORY;');
    db.run('DELETE FROM TB_PRODUCT_SALES;', callback);
}

const restoreAllProducts = (data, callback) => {
    let query = 'INSERT  INTO TB_PRODUCTS (code, name, value, type, keyCode, isRemoved) VALUES ';

    data.forEach(item => {
        query += `(${item.code}, "${item.name}", ${item.value}, ${item.type}, "${item.keyCode}", ${item.isRemoved}),`;
    });

    query = query.substring(0, query.length - 1) + ';';

    db.run(query, callback);
}

const restoreAllSales = (data, callback) => {
    let query = 'INSERT  INTO TB_SALES (code, date, dayOfWeek) VALUES ';

    data.forEach(item => {
        query += `(${item.code}, "${item.date}", ${item.dayOfWeek}),`;
    });

    query = query.substring(0, query.length - 1) + ';';

    db.run(query, callback);
}

const restoreAllProductSales = (data, callback) => {
    let query = 'INSERT  INTO TB_PRODUCT_SALES (saleCode, productCode, value) VALUES ';

    data.forEach(item => {
        query += `(${item.saleCode}, ${item.productCode}, ${item.value}),`;
    });

    query = query.substring(0, query.length - 1) + ';';

    db.run(query, callback);
}

const restoreAllInventory = (data, callback) => {
    let query = 'INSERT  INTO TB_INVENTORY (code, productCode, amount) VALUES ';

    data.forEach(item => {
        query += `(${item.code}, ${item.productCode}, ${item.amount}),`;
    });

    query = query.substring(0, query.length - 1) + ';';

    db.run(query, callback);
}

const getInventoryAlert = (callback) => {
    db.all(`
        SELECT  *
        FROM    TB_INVENTORY_ALERT
    `, callback);
}

const setInventoryAlert = (data, callback) => {
    db.run(`
        DELETE  FROM TB_INVENTORY_ALERT
    `);

    db.run(`
        INSERT  INTO TB_INVENTORY_ALERT (minAmount, minWeight)
        VALUES  (${data.minAmount}, ${data.minWeight})
    `, callback);
}

const getAlertProducts = (callback) => {
    db.all(`
    SELECT  INVENTORY.code AS inventoryCode,
            PRODUCTS.code AS productCode,
            INVENTORY.amount,
            PRODUCTS.name,
            PRODUCTS.type
    FROM    TB_INVENTORY INVENTORY
    INNER   JOIN TB_PRODUCTS PRODUCTS
    ON      INVENTORY.productCode = PRODUCTS.code
    WHERE   (
            PRODUCTS.type = 2 AND
            INVENTORY.amount <= (
                SELECT  minAmount
                FROM    TB_INVENTORY_ALERT
            )
            ) OR
            (
                PRODUCTS.type = 1 AND
                INVENTORY.amount <= (
                    SELECT  minWeight
                    FROM    TB_INVENTORY_ALERT
                )
            ) AND
            PRODUCTS.isRemoved = 0
    `, callback);
}

export { 
    createTables,
    findAllProducts,
    createProduct,
    updateProduct,
    removeProduct,
    updateProductValue,
    createSale,
    addProductSale,
    reportBestProduct,
    reportBestDay,
    reportSaleByDay,
    findAllProductBackup,
    findAllSaleBackup,
    findAllProductSaleBackup,
    restoreAllProducts,
    restoreAllSales,
    restoreAllProductSales,
    clearTables,
    getConfiguration,
    setConfiguration,
    findAllInventory,
    findAllInventoryBackup,
    createInventory,
    restoreAllInventory,
    updateInventory,
    getInventoryAlert,
    setInventoryAlert,
    getAlertProducts,
    getAllSales,
    getProductSaleByCode
};