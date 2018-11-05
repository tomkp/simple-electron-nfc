import {NFC} from 'nfc-pcsc';


const initialiseNfc = (webContents) => {


    console.log(`webContents ${webContents}`);

    const nfc = new NFC(); // optionally you can pass logger


    nfc.on('reader', reader => {

        console.log(`\n${reader.reader.name}  device attached`);

        webContents.send('device-activated', {device: reader.reader.name});

        // needed for reading tags emulated with Android HCE
        // custom AID, change according to your Android for tag emulation
        // see https://developer.android.com/guide/topics/connectivity/nfc/hce.html
        reader.aid = 'F222222222';

        reader.on('card', card => {

            // card is object containing following data
            // [always] String type: TAG_ISO_14443_3 (standard nfc tags like Mifare) or TAG_ISO_14443_4 (Android HCE and others)
            // [always] String standard: same as type
            // [only TAG_ISO_14443_3] String uid: tag uid
            // [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response

            console.log(`\n${reader.reader.name}  card detected`, card);

            webContents.send('card-inserted', {device: reader.reader.name, card});
        });

        reader.on('card.off', card => {
            console.log(`\n${reader.reader.name}  card removed`, card);

            webContents.send('card-removed', {device: reader.reader.name, card});
        });

        reader.on('error', err => {
            console.log(`\n${reader.reader.name}  an error occurred`, err);
        });

        reader.on('end', () => {
            console.log(`\n${reader.reader.name}  device removed`);

            webContents.send('device-deactivated', {device: reader.reader.name});
        });

    });

    nfc.on('error', err => {
        console.log('\nan error occurred', err);
    });

};

export default initialiseNfc;
