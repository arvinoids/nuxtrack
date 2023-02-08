import PocketBase from 'pocketbase'

const cnf = useRuntimeConfig().public
const pb = new PocketBase(cnf.pocketBaseURL)
pb.autoCancellation(false)

// When the dashboard loads, the system looks for users under each group from the currentlist collection. 
//If there are no users, the system creates the currentlist by running a query from the counter sorted by count.

//The counter collection contains the count of cases for each user under a group.

//We need a way to refresh the counter every time changes are made. 

// I made this function because pocketbase hates me creating my own filter string ad hoc
function createFilter(field: string, value: string) {
    let filter = field + "='" + value + "'"
    return filter
}

async function createCounter(user: string, group: string) {
    const count = getCount(user, group)
    const data = {
        "user": user,
        "group": group,
        "count": count
    }
    try {
        await pb.collection('counter').create(data);
    } catch (error) { console.log(error) }
}

async function updateCounter(group: string, user: string) {
    let groupFilter = createFilter('group', group)
    let userFilter = createFilter('user', user)
    let newCount = await getCount(user, group)
    console.log('new count: ',newCount)
    let data = {
        "user": user,
        "group": group,
        "count": newCount
    }
    const record = await pb.collection('counter').getFirstListItem(groupFilter + "&&" + userFilter)
    console.log('counter record ',record)
    try {
        let res = await pb.collection('counter').update(record.id, data)
        console.log('result',res)
    } catch (e) { console.log(e) }
}

async function getCount(user: string, group: string) {
    const groupFilter = createFilter("group", group)
    const userFilter = createFilter("user", user)
    const res = await pb.collection('cases').getList(1, 10000, { "filter": groupFilter + "&&" + userFilter, '$autoCancel': false })
    return res.totalItems
}

async function getGroupUsers(group: string) {
    const groupFilter = "group='" + group + "'"
    const res = await pb.collection('cases').getList(1, 10000, { "filter": groupFilter, '$autoCancel': false })
    if (res.totalItems > 0) {
        const users = res.items.map((ele: { user: any; }) => ele.user).filter((ele: any, i: any, arr: string | any[]) => arr.indexOf(ele) == i); //pick unique users https://stackoverflow.com/questions/53720210/how-to-get-unique-value-of-keys-from-array-of-object-using-javascript
        //console.log("users for group "+group+": ",users)   
        return users
    }

}

async function counterExists(user: string, group: string) {
    const groupFilter = "group='" + group + "'"
    const userFilter = "user='" + user + "'"
    const counter = await pb.collection('counter').getList(1, 10000, { "filter": groupFilter + "&&" + userFilter, '$autoCancel': false })
    if (counter.totalItems === 0) return false
    else return true
}

export const useCreateGroupList = async (group: string) => {
    console.log("running creategroupcounter")
    const users = await getGroupUsers(group)
    console.log(`users for group ${group}:`, users)
    if (users!.length === 0) return
    else {
        users!.forEach((user: string) => {
            if (!counterExists(user, group))
                try { createCounter(user, group); console.log("counter created") }
                catch (e) { console.log(e) }
        })
    }

}

// for realtime assign
export async function assignCase(caseId: string, user: string, group: string) {
    const data = {
        "user": user,
        "group": group,
        "case": caseId,
        "assignedBy": pb.authStore.model!.username
    }
    if (await caseExists(caseId)) {
        return "This case has already been assigned. Please check."
    } else {
        await pb.collection('cases').create(data)
        await updateCounter(group, user)
        await createCurrentList(group)
        return "Case has been saved. The owner should receive a notification shortly."
    }
}

//case checking if it exists
async function caseExists(caseId: string) {
    const caseFilter = 'case="' + caseId + '"'
    try {
        const record = await pb.collection('cases').getFirstListItem(caseFilter)
        if (record) return true; else return false
    } catch (e) {
        return false
    }
}

// returns the case cont for specific user in a group
// async function reRunCount(userId: string, groupId: string) {
//     const groupFilter = 'group="' + groupId + '"'
//     const userFilter = 'user="' + userId + '"'
//     const combinedFilter = groupFilter + " && " + userFilter
//     const cases = await pb.collection('cases').getList(1, 500, { filter: combinedFilter })
//     return cases.totalItems
// }

async function deleteCurrentList(groupId: string) {
    console.log('deleting currentlist for ', groupId)
    const groupFilter: string = "group=" + '"' + groupId + '"'
    const old = await pb.collection('currentlist').getList(1, 100, { filter: groupFilter })
    const items = old.items
    items.forEach(async (item) => {
        await pb.collection('currentlist').delete(item.id)
    })
}

//create current list for when all users have been assigned a case
export async function createCurrentList(groupId: string) {
    console.log('starting create current list for ', groupId)
    const queryFilter = 'group="' + groupId + '"'
    //delete existing entries first
    await deleteCurrentList(groupId)
    const list = await pb.collection('counter').getList(1, 500, { filter: queryFilter, sort: '+count', '$autoCancel': false })
    console.log('generating currentlist for group ', groupId)
    list.items.forEach(async (item: any, i: number) => {
        let data = { "user": item.user, "group": groupId, "count": item.count, "order": i + 1 }
        await pb.collection('currentlist').create(data)
    });
}



// To skip and catch up
// export async function useSkipCatch(groupId:string) {
//     console.log('executing skip catch up later')
//     const groupFilter:string = "group="+'"'+groupId+'"'
//     let record = await pb.collection('currentposition').getFirstListItem(groupFilter,{ '$autoCancel': false })
//     let id:string = record.id
//     let position:number = record.position
//     try {
//       await pb.collection('currentposition').update(id,{ "group": groupId, "position": position+1},{ '$autoCancel': false })
//       if(await isPositionExceeded(groupId)){
//         await resetPosition(id)
//       }
//     } catch (e) { console.log(e) }
// }


async function isPositionExceeded(groupId: string) {
    console.log('checking if position has exceeded')
    const groupFilter: string = "group=" + '"' + groupId + '"'
    const currentlist = await pb.collection('currentlist').getList(1, 1000, { filter: groupFilter })
    let max = currentlist.totalItems
    let rec = await pb.collection('currentposition').getFirstListItem(groupFilter, { '$autoCancel': false })
    let position = rec.position
    if (position > max) {
        console.log(position > max)
        createCurrentList(groupId!)
        return true
    } else return false
}

async function resetPosition(recordId: string) {
    console.log("resetting position of ", recordId)
    try {
        await pb.collection('currentposition').update(recordId, { "position": 1 }, { '$autoCancel': false })
    } catch (e) { console.log(e) }
}

export async function useSkipOut(userId: string, groupId: string) {
    const random = Math.random().toString(36).substring(3, 9)
    const data = {
        "user": userId,
        "group": groupId,
        "case": "OutOfOffice-" + random,
        "assignedBy": pb.authStore.model!.username
    };
    await pb.collection('cases').create(data)
    console.log("created outOfOffice")
    await updateCounter(groupId, userId)
    await createCurrentList(groupId)
    location.reload()
}

// async function useSkipCatch(groupId: string) {
//     console.log('executing skip catch up later')
//     const groupFilter: string = "group=" + '"' + groupId + '"'
//     let users = await pb.collection('currentlist').getList(1, 1000, { filter: groupFilter, expand: "user", '$autoCancel': false })

// }

export async function getUserCases(userId?: string) {
    console.log('getting cases for user ', userId)
    let cases;
    const userFilter: string = "user=" + '"' + userId + '"'
    if (!userId) { cases = await pb.collection('cases').getList(1, 1000, { expand: "user, group", sort: "-created" }) } else {
        cases = await pb.collection('cases').getList(1, 1000, { filter: userFilter, expand: "user, group", sort: "-created" })
    }
    return cases
}