import PocketBase from 'pocketbase'
const cnf = useRuntimeConfig().public
const pb = new PocketBase(cnf.pocketBaseURL)
pb.autoCancellation(false);

const users = await pb.collection('users').getList(1,100,{ '$autoCancel': false, })
const groups = await pb.collection('groups').getList(1,100,{ '$autoCancel': false, })
const cases = await pb.collection('cases').getList(1,100,{ '$autoCancel': false, })
const counters = await pb.collection('counter').getList(1,10000,{ '$autoCancel': false, })

// function getGroupUsers(group: any)
// {
//     const groupUsers = users.filter((row: { memberOf: string })=>row.memberOf.includes(group))
//     return groupUsers
// }

export const useCreateList = async (group: string) =>
{
}

//for counterCreator
function getMembership(user:string){
    const groups = users.items.filter((row: { id: string })=>row.id===user)
    return groups[0].memberOf
 }
 
 async function createCounter(group:string,user:string) {
     const count = await getCount(user,group)
     const data = {
         "user":user,
         "group":group,
         "count":count
     }
     try {
         await pb.collection('counter').create(data,{ '$autoCancel': false });
     } catch (error) { console.log(error)}
 }
 
 async function getCount(user: string,group: string)
 {
     const rows = cases.items.filter((row: { user: string; group: string; })=>((row.group===group)&&(row.user===user)))
     return rows.length
 }
 
 
 function getUsers()
 {
     let data:any = users.items
     data = data.map(({id}) => ({id}));
     data = Object.values(data)
     return data
 }
 
 export const useCounterCreator = async () =>
 {
    let users = getUsers()
     users.forEach((user: any) => {
         const groups = getMembership(user.id)
         groups.forEach( (group: string) => {
             createCounter(group, user.id)
         })        
     })
 }

 // for realtime assign
 async function assignCase(caseId:string,userId:string,groupId:string) {
    const data={
        "user":userId,
        "group":groupId,
        "case":caseId
    }
    if (await caseExists(caseId)) {
        return "This case has already been assigned."
    } else {
        await pb.collection('cases').create(data)
        reRunCount(userId,groupId)
        return "Case has been saved. The owner should receive a notification shortly."
    }
 }

 async function caseExists(caseId:string) {
    const caseFilter = 'case="'+caseId+'"'
    try{
            const record = await pb.collection('cases').getFirstListItem(caseFilter)
            return true
    } catch(e) { 
        console.log(e)
        return false
    }
 }

 async function reRunCount(userId:string,groupId:string) {
    pb.collection('cases').getList(1,500,{filter:''})

 }
