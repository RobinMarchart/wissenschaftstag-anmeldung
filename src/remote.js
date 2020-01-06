import { encrypt, message, initWorker, key } from "openpgp";
import axios from "axios";
// eslint-disable-next-line import/no-webpack-loader-syntax
import pgpWorker from "worker-loader!./openpgp.worker.js"

function log_too(data) {
    console.log(data);
    return data;
}

async function sendRegistration(remote_config, reg_data) {
    console.log(remote_config.url + "register");
    return await axios.put(remote_config.url + "register", {data:log_too((await encrypt({
        message: message.fromText(JSON.stringify(reg_data)),
        publicKeys: (await remote_config.key).keys,
        armor: true
    })).data),
    timestamp: Math.floor(Date.now() / 1000)
});
}

class RemoteConnection {

    constructor(config) {
        initWorker({ workers: [new pgpWorker()] });
        this.remote = { url: config.url, key: key.readArmored(config.key) };
    }

    send(reg_data) {
        return sendRegistration(this.remote, reg_data);
    }

}

export default RemoteConnection;