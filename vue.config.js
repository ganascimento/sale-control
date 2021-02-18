module.exports = {
    "transpileDependencies": [
      "vuetify"
    ],
    pluginOptions: {
      electronBuilder: {
        nodeIntegration: true,
        externals: ['serialport', 'sqlite3'],
        builderOptions: {
          extraResources: ['src/res/', 'src/database']
        }
      }
    }
  }