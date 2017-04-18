# chkInstanceRecovery
Using nodejs checks to determine if ec2 autorecovery is enabled.  Script will enumerate all running instances in a specific region (defined on line 7).  Output will show instance id and true if auto recovery is enabled or false if autorecovery is NOT enabled

## Prerequisites
- Requires node.js -> https://nodejs.org
- Install node aws-sdk -> https://aws.amazon.com/sdk-for-node-js/
- current script uses a config.json file. -> http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html


## Running
node chkInstRecovery.js

