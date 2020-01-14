import { encrypt, message, initWorker, key } from "openpgp";
import axios from "axios";
// eslint-disable-next-line import/no-webpack-loader-syntax
import pgpWorker from "worker-loader!./openpgp.worker.js"

function log_too(data) {
    console.log(data);
    return data;
}

async function sendRegistration(remote_config, reg_data, old,not) {
    console.log(remote_config.url + "/register");
    return await axios.post(remote_config.url + "/register", {
        data: log_too((await encrypt({
            message: message.fromText(JSON.stringify(reg_data)),
            publicKeys: (await remote_config.key).keys,
            armor: true
        })).data),
        add: reg_data[4] ? { first: reg_data[3], second: reg_data[4] } : reg_data[3],
        remove: old ? old[4] ? { first: old[3], second: old[4] } : old[3] : undefined

    }).then(x=>{
        not.submit("Anmelden erfolgreich",( x.data as {message:string}).message);
    },x=>{
        console.error(x);

        not.submit("Fehler "+( x.response.data as {status:number}).status,( x.response.data as {message:string}).message)
    });
}

class RemoteConnection {

    remote: { url: string, key: any };
    not:any;

    constructor(config) {
        initWorker({ workers: [new pgpWorker()] });
        this.remote = { url: config.url, key: key.readArmored(config.key) };
    }

    send(reg_data, old) {
        return sendRegistration(this.remote, reg_data, old,this.not);
    }
    getHandle(){
        return {send:(x1,x2)=>this.send(x1,x2)};
    }

    setNot(not){
        this.not=not;
    }

}

export default RemoteConnection;