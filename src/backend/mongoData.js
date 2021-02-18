import mongoose from 'mongoose';

const connectionString = 'mongodb+srv://admin:Ic53748956Db@cluster0.o10g8.mongodb.net/iceControl?retryWrites=true&w=majority';

const connect = async () => {
    try {
        await mongoose.connect(connectionString, { useNewUrlParser: true });
        return true;
    }
    catch {
        return false;
    }
}

const ProductSchema = new mongoose.Schema({
    code: { type: Number },
    name: { type: String },
    value: { type: Number },
    type: { type: Number },
    keyCode: { type: String },
    isRemoved: { type: Number }
});

const SaleSchema = new mongoose.Schema({
    code: { type: Number },
    date: { type: String },
    dayOfWeek: { type: Number }
});

const ProductSaleSchema = new mongoose.Schema({
    saleCode: { type: Number },
    productCode: { type: Number },
    value: { type: Number }
});

const InventorySchema = new mongoose.Schema({
    code: { type: Number },
    productCode: { type: Number },
    amount: { type: Number }
});

const ProductModel = mongoose.model('Product', ProductSchema);
const SaleModel = mongoose.model('Sale', SaleSchema);
const ProductSaleModel = mongoose.model('ProductSale', ProductSaleSchema);
const InventoryModel = mongoose.model('Inventory', InventorySchema);

export { 
    connect,
    ProductModel,
    SaleModel,
    ProductSaleModel,
    InventoryModel
};