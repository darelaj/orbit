import {expect,test} from 'vitest';
import {OptimizerRunner,type WorkerPort} from './runner';
import type {SearchRequest,SearchResponse} from '../../workers/optimizer.protocol';
import {defaultOptions} from '../../domain/optimizer';
import {emptyProfile} from '../../domain/comparison';
class Stub implements WorkerPort{
  onmessage:WorkerPort['onmessage']=null;onerror:WorkerPort['onerror']=null;request:SearchRequest|null=null;terminated=false;
  postMessage(request:SearchRequest){this.request=request;}
  terminate(){this.terminated=true;}
  progress(){const {runId,revision}=this.request!;this.onmessage?.(new MessageEvent<SearchResponse>('message',{data:{kind:'progress',runId,revision,progress:{total:'100',evaluated:1,feasible:1,invalid:0}}}));}
}
test('cancel/restart/import invalidation terminate workers and suppress stale messages',()=>{
  const workers:Stub[]=[];const messages:SearchResponse[]=[];
  const runner=new OptimizerRunner(()=>{const w=new Stub();workers.push(w);return w;},m=>messages.push(m));
  const input={profile:emptyProfile,relics:[],options:defaultOptions};
  runner.start(input,1);workers[0].progress();expect(messages).toHaveLength(1);
  runner.cancel();expect(workers[0].terminated).toBe(true);workers[0].progress();expect(messages).toHaveLength(1);
  runner.start(input,1);workers[0].progress();workers[1].progress();expect(messages).toHaveLength(2);
  runner.invalidate(2);workers[1].progress();expect(messages).toHaveLength(2);expect(workers[1].terminated).toBe(true);
});
