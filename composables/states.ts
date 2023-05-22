export const useAuth = ()=> 
useState(() => ({ 
    isAuthenticated: false,
    role: null
 }))

export const useRefresher = ()=>
useState(()=> ({
    count: 0
}))

export const useCaseId = ()=> useState(()=> (''))

export const useFromGroup = ()=> useState(()=>(''))
export const useDataUpdated = ()=> useState(()=>0)

export const useTheme = ()=> useState(()=>('mytheme'))
export const useReload = ()=> useState(()=> (0))
export const useSelectedUser = ()=> useState(()=> (''))

export const useLoggedInUsername = ()=> useState(()=> (''))
export const useEscalation = ()=> useState(()=> (false))

export const useNotify = ()=> useState(()=> (false))

export const useLoading = ()=> useState(()=>(true))
export const useStatusChanged = ()=> useState(()=>(0))
export const useCaseCountChanged = ()=> useState(()=>(0))
 