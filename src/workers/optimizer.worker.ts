/// <reference lib="webworker" />
import {optimize} from '../domain/optimizer';
import type {SearchRequest,SearchResponse} from './optimizer.protocol';
const worker=self as DedicatedWorkerGlobalScope;
worker.onmessage=(event:MessageEvent<SearchRequest>)=>{
  const {runId,revision,input}=event.data;
  const send=(response:SearchResponse)=>worker.postMessage(response);
  try{
    const search=optimize(input);let next=search.next();
    while(!next.done){send({runId,revision,kind:'progress',progress:next.value});next=search.next();}
    send({runId,revision,kind:'complete',report:next.value});
  }catch(error){send({runId,revision,kind:'error',message:error instanceof Error?error.message:'Search failed.'});}
};
