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
test('late terminal/error events cannot replace a newer run and failures release the worker',()=>{
  const workers:Stub[]=[];const messages:SearchResponse[]=[];
  const runner=new OptimizerRunner(()=>{const worker=new Stub();workers.push(worker);return worker;},m=>messages.push(m));
  const input={profile:emptyProfile,relics:[],options:defaultOptions};
  runner.start(input,1);const old=workers[0];const request=old.request!;
  runner.start(input,2);
  old.onmessage?.(new MessageEvent<SearchResponse>('message',{data:{kind:'complete',runId:request.runId,revision:request.revision,report:{results:[],total:'1',evaluated:1,feasible:0,invalid:0,invalidReasons:[],exhaustive:true,counts:[1,1,1,1,1,1]}}}));
  old.onerror?.(new ErrorEvent('error'));expect(messages).toEqual([]);
  workers[1].onerror?.(new ErrorEvent('error'));
  expect(workers[1].terminated).toBe(true);expect(messages).toHaveLength(1);expect(messages[0].kind).toBe('error');
  workers[1].progress();expect(messages).toHaveLength(1);
});
