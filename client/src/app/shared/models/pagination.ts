export type Pagination<T> = {
  pageInedxt:number;
  pageSize:number;
  count:number;
  data: T[];
}
