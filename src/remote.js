import {encrypt,message,initWorker,key} from "openpgp";
import axios from "axios";

function log_too(data){
    console.log(data);
    return data;
}

async function sendRegistration(remote_config,reg_data){
    return await axios.put(remote_config.url,log_too((await encrypt(
        {
        message:message.fromText(JSON.stringify(
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
        initWorker();
        this.remote={url:config.url,key:key.readArmored(config.key)};
    }

    send(reg_data){
        return sendRegistration(this.remote,reg_data);
    }

}

export default RemoteConnection;