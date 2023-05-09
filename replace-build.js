const replace = require('replace-in-file');
const package = require('./package.json');
const buildVersion = package.version;
const buildTimestamp = getTimestamp(new Date());

const options = {
    // files: 'src/environments/environment.prod.ts',
    // from: [/"version": "(.*)"/g, /"buildTimestamp": "(.*)"/g],
    // to: [
    //     '"version": "' + buildVersion + '"',
    //     '"buildTimestamp": "' + buildTimestamp + '"',
    // ],
    files: 'src/environments/environment.prod.ts',
    from: /version: '(.*)'/g,
    to: "version: '" + buildVersion + ' (' + buildTimestamp + ')' + "'",
    allowEmptyPaths: false,
};

try {
    if (!replace.sync(options)) {
        throw (
            "Please make sure that file '" +
            options.files +
            "' exists and declares properties 'version' and 'buildTimestamp'"
        );
    }

    console.log(
        'Build info set: ' + buildVersion + ' (' + buildTimestamp + ')',
    );
} catch (error) {
    console.error('Error occurred:', error);

    throw error;
}

function getTimestamp(date) {
    const padding = 2;
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    const d = zeroPad(date.getDate(), padding);
    const m = zeroPad(date.getMonth() + 1, padding);
    const y = date.getFullYear();
    const h = zeroPad(date.getHours(), padding);
    const min = zeroPad(date.getMinutes(), padding);
    const s = zeroPad(date.getSeconds(), padding);

    return y + m + d + h + min + s;
}
