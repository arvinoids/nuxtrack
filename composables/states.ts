export const useAuth = ()=> 
useState(() => ({ 
    isAuthenticated: false,
    role: null
 }))

export const useDisabled = ref(true)


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
