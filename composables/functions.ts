//const pb = await useNuxtApp().$pb
const pb = useNuxtApp().$pb

async function createCounter(user: string, group: string){
    const count = getCount(user,group)
    const data = {
        "user":user,
        "group":group,
        "count":count
    }
    try {
        await pb.collection('counter').create(data);
    } catch (error) { console.log(error)}
}

async function getCount(user: string,group: string)
{
    const groupFilter = "group='"+group+"'"
    const userFilter = "user='"+user+"'"
    const res = await pb.collection('cases').getList(1,10000,{"filter":groupFilter+"&&"+userFilter,'$autoCancel': false})
    return res.totalItems
}

async function getGroupUsers(group: string)
{
    const groupFilter = "group='"+group+"'"
    const res = await pb.collection('cases').getList(1,10000,{"filter":groupFilter,'$autoCancel': false})
    if(res.length>0){
        const users = res.items.map((ele: { user: any; }) => ele.user).filter((ele: any, i: any, arr: string | any[]) => arr.indexOf(ele) == i); //pick unique users https://stackoverflow.com/questions/53720210/how-to-get-unique-value-of-keys-from-array-of-object-using-javascript
    //console.log("users for group "+group+": ",users)   
    return users
    }
 
}

async function counterExists(user: string,group: string){
    const groupFilter = "group='"+group+"'"
    const userFilter = "user='"+user+"'"
    const counter = await pb.collection('counter').getList(1,10000,{"filter":groupFilter+"&&"+userFilter,'$autoCancel': false})
    if (counter.totalItems===0) return false
        else return true
}

export const useCreateGroupList = async (group: string) =>
{
    console.log("running creategroupcounter")
    const users = await getGroupUsers(group)
    console.log(`users for group ${group}:`,users)
    if(users.length===0) return
    else { users.forEach((user: string) =>
    {
        if(!counterExists(user,group))
        try{ createCounter(user,group); console.log("counter created") }
        catch(e) { console.log(e)}
    })
    }
    
}

