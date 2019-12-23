import pgp from "openpgp";
import axios from "axios";

function log_too(data){
    console.log(data);
    return data;
}

async function sendRegistration(remote_config,reg_data){
    return await axios.put(remote_config.url,log_too((await pgp.encrypt(
        {
        message:pgp.message.fromText(JSON.stringify(
            {
            data:reg_data,
            timestamp:Math.floor(Date.now()/1000)
        })),
        publicKeys:(await remote_config.key).keys,
        armor:true
    })).data));
}

class RemoteConnection{

    constructor(config){
        pgp.initWorker();
        this.remote={url:config.url,key:pgp.key.readArmored(config.key)};
    }

    send(reg_data){
        return sendRegistration(this.remote,reg_data);
    }

}

export default RemoteConnection;