export const useAuth = ()=> 
useState(() => ({ 
    isAuthenticated: false,
    role: null
 }))

export const useDisabled = ref(true)

export const useSelector = ()=> 
useState(() => ({
    user: '',
    group: ''
}))

export const useRefresher = ()=>
useState(()=> ({
    count: 0
}))

export const useCaseId = ()=> useState(()=> (''))

export const useFromGroup = ()=> useState(()=>(''))
export const useDataUpdated = ()=> useState(()=>0)