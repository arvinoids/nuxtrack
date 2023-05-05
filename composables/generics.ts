export function useGetBooleanFromLocalStorage(value:string|null){
    let result:boolean;
    if(value==='true') result = true
    else result = false
    return result
  }
  