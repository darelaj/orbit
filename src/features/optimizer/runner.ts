import type {SearchInput} from '../../domain/optimizer';
import type {SearchRequest,SearchResponse} from '../../workers/optimizer.protocol';
export interface WorkerPort {onmessage:((event:MessageEvent<SearchResponse>)=>unknown)|null;onerror:((event:ErrorEvent)=>unknown)|null;postMessage:(request:SearchRequest)=>void;terminate:()=>void;}
export class OptimizerRunner {
  private worker:WorkerPort|null=null;
  private runId=0;
  private revision=0;
  constructor(private factory:()=>WorkerPort,private receive:(response:SearchResponse)=>void){}
  cancel(){this.runId++;this.worker?.terminate();this.worker=null;}
  invalidate(revision:number){this.cancel();this.revision=revision;}
  start(input:SearchInput,revision:number){
    this.cancel();this.revision=revision;const runId=this.runId;const worker=this.factory();this.worker=worker;
    worker.onmessage=event=>{
      const message=event.data;
      if(this.worker!==worker||message.runId!==this.runId||message.revision!==this.revision)return;
      if(message.kind!=='progress'){worker.terminate();this.worker=null;}
      this.receive(message);
    };
    worker.onerror=()=>{if(this.worker===worker){worker.terminate();this.worker=null;this.receive({runId,revision,kind:'error',message:'Optimizer worker failed. Try a smaller budget or reload Orbit.'});}};
    try{worker.postMessage({runId,revision,input});}catch(error){this.cancel();throw error;}
  }
}
