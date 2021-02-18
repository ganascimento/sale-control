export default {
    methods: {
        goMarket() {
            this.$router.push('/Market');
        },
        goProduct() {
            this.$router.push('/Product');
        },
        goReport() {
            this.$router.push('/Report');
        },
        goConfiguration() {
            this.$router.push('/Configuration');
        },
        goInventory() {
            this.$router.push('/Inventory');
        }
    }
}