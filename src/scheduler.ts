export default class Scheduler{
    _func:()=>void;
    _repeat_in:number
    _next:{cancelled:boolean}


    constructor(func:()=>void,repeat_in:number,delay:number=0){
        this._func=func;
        this._repeat_in=repeat_in;
        this._next={cancelled:true}
        this._schedule(delay);
    }

    _run(cancelled:{cancelled:boolean}){
        if(!cancelled){
            try {
                this._func();
            } catch (error) {
                this._schedule(this._repeat_in);
                throw new Error(error);
            }
            this._schedule(this._repeat_in);
        }
    }

    _schedule(delay:number){
        this._next.cancelled=true;
        this._next={cancelled:false};
        setTimeout(()=>this._run(this._next),delay);
    }

    cancel(){
        this._next.cancelled=true;
    }

    run_now(){
        this._schedule(0);
    }
}