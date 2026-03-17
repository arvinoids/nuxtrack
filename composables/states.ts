import type { notification } from "custom-types"
import type { AuthModel } from "pocketbase"
import type { expandedCounter } from "pocketbase-types"
import type { UsersResponse, LeavesResponse, GroupsResponse } from "~/pocketbase-types"

export const useAuth = ()=> 
useState(() => ({ 
    isAuthenticated: false,
    role: 'user'
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

export const useEscalation = ()=> useState(()=> (false))

export const useNotify = ()=> useState(()=> (false))

export const useLoading = ()=> useState(()=>(true))
export const useStatusChanged = ()=> useState(()=>(0))
export const useCaseCountChanged = ()=> useState(()=>(0))
export const useUserWhoChangedStatus =()=> useState(()=>(''))

export const useCounters = ()=> useState<expandedCounter[]>(()=>([]))
export const useAllUsers = ()=> useState<UsersResponse[]>(()=>[])
export const useAllGroups = ()=> useState<GroupsResponse[]>(()=>[])
export const useNotifications = ()=> useState<notification[]>(()=>([]))
export const useCurrentUser = ()=> useState<AuthModel>(()=>[])
export const usePercentComplete = (sessionId: string = 'default')=> useState(`percentComplete-${sessionId}`, ()=>(0))
export const useIsDarkMode = (()=>useState(()=>false))
export const useShowDropdown = ()=> useState(()=>(false))
export const useActiveLeaves = ()=> useState<LeavesResponse[]>(()=>[])
export const useUserLeaveNotificationShown = ()=> useState(()=>(true))
