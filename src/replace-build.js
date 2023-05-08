import { sync } from 'replace-in-file';
import process from 'process';
var buildVersion = process.argv[2];
const options = {
    files: 'src/environments/environment.prod.ts',
    from: /{BUILD_VERSION}/g,
    to: buildVersion,
    allowEmptyPaths: false,
};

try {
    let changedFiles = sync(options);
    console.log('Build version set: ' + buildVersion, changedFiles);
}
catch (error) {
    console.error('Error occurred:', error);
}
