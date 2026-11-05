import type {Progress,SearchInput,SearchReport} from '../domain/optimizer';
export type SearchRequest={runId:number;revision:number;input:SearchInput};
export type SearchResponse={runId:number;revision:number}&({kind:'progress';progress:Progress}|{kind:'complete';report:SearchReport}|{kind:'error';message:string});
