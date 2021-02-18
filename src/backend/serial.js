import { getConfiguration, setConfiguration } from '../database/db';

const { ipcMain } = require('electron');
const SerialPort = require('serialport');

const readSerial = (event, data) => {
	const port = new SerialPort(data.port,  { 
		baudRate: parseInt(data.baudRate),
		autoOpen: false
	}, true);

	const readline = SerialPort.parsers.Readline;
	const parser = new readline();

	setTimeout(function() {
		port.open(function () {  
			port.pipe(parser);
		});
	}, 1000);

	port.on('readable', function () {
		try {
			let weight = port.read();

			if (weight)
				weight = parseFloat(weight.toString().substring(1));
			else
				weight = '0';

			event.reply('get-weight-from-scale', {
				weight
			});
		}
		catch (e){
			console.log(e);
		}
	});
}

ipcMain.on('get-weight-from-scale', (event) => {
	getConfiguration((err, result) => {
		if (!err && result && result.length > 0) {
			readSerial(event, result[0]);
		}
		else {
			event.reply('get-weight-from-scale-error', {
				error: true
			});
		}
	});
});

ipcMain.on('get-configuration', (event) => {
    getConfiguration((err, result) => {
        event.reply('get-configuration', {
            result: result[0]
        });
    });
});

ipcMain.on('set-configuration', (event, config) => {
    setConfiguration(config, (err) => {
        let status = true;

        if (err)
			status = false;

        event.reply('set-configuration', {
            status
        });
    });
});