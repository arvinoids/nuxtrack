import PocketBase, { ListResult, Record } from "pocketbase";
import { LogData, userEntry } from "custom-types";

const cnf = useRuntimeConfig().public;
const pb = new PocketBase(cnf.pocketBaseURL);
pb.autoCancellation(false);

// When the dashboard loads, the system looks for users under each group from the currentlist collection.
//If there are no users, the system creates the currentlist by running a query from the counter sorted by count.

//The counter collection contains the count of cases for each user under a group.

//We need a way to refresh the counter every time changes are made.


function createFilter(field: string, value: string) {
  let filter = field + "='" + value + "'";
  return filter;
}

async function updateCounter(group: string, user: string) {
  let groupFilter = createFilter("group", group);
  let userFilter = createFilter("user", user);
  let newCount = await getCount(user, group);
  // console.log("new count: ", newCount);
  let data = {
    user: user,
    group: group,
    count: newCount,
  };
  const record = await pb
    .collection("counter")
    .getFirstListItem(groupFilter + "&&" + userFilter);
  // console.log("counter record ", record);
  try {
    let res = await pb.collection("counter").update(record.id, data);
    // console.log("result", res);
  } catch (e) {
    console.log(e);
  }
}

async function getCount(user: string, group: string) {
  const groupFilter = createFilter("group", group);
  const userFilter = createFilter("user", user);
  const res = await pb.collection("cases").getList(1, 10000, {
    filter: groupFilter + "&&" + userFilter,
    $autoCancel: false,
  });
  return res.totalItems;
}

export async function useAssignCase(caseId: string, user: string, group: string) {
  const data = {
    user: user,
    group: group,
    case: caseId.trim(),
    assignedBy: pb.authStore.model!.username,
  };

  const result = { message: "", status: "" };
  if (caseId === "")
    return { message: "Case ID cannot be blank", status: "failed" };
  if (await caseExists(caseId)) {
    result.message =
      "This case has already been assigned. Please double-check and try again.";
    result.status = "failed";
    return result;
  } else {
    await pb.collection("cases").create(data);
    await updateCounter(group, user);
    await createCurrentList(group);
    let owner = (await useGetUsernameFromId(user)).toUpperCase()
    result.message =
      `Case has been assigned. ${owner} should receive a notification shortly.`;
    result.status = "success";
    return result;
  }
}

//case checking if it exists
export async function caseExists(caseId: string) {
  const caseFilter = 'case="' + caseId + '"';
  try {
    const record = await pb.collection("cases").getFirstListItem(caseFilter);
    if (record) return true;
    else return false;
  } catch (e) {
    return false;
  }
}

async function deleteCurrentList(groupId: string) {
  // console.log("deleting currentlist for ", groupId);
  const groupFilter: string = "group=" + '"' + groupId + '"';
  const old = await pb
    .collection("currentlist")
    .getList(1, 100, { filter: groupFilter });
  const items = old.items;
  items.forEach(async (item) => {
    await pb.collection("currentlist").delete(item.id);
  });
}

//create current list for when all users have been assigned a case
export async function createCurrentList(groupId: string) {
  // console.log("starting create current list for ", groupId);
  const queryFilter = 'group="' + groupId + '"';
  //delete existing entries first
  await deleteCurrentList(groupId);
  const list = await pb.collection("counter").getList(1, 500, {
    filter: queryFilter,
    sort: "+count",
    $autoCancel: false,
  });
  //  console.log("generating currentlist for group ", groupId);
  list.items.forEach(async (item: any, i: number) => {
    let data = {
      user: item.user,
      group: groupId,
      count: item.count,
      order: i + 1,
    };
    await pb.collection("currentlist").create(data);
  });
}

export async function useSkipOut(userId: string, groupId: string) {
  const random = Math.random().toString(36).substring(3, 9);
  const data = {
    user: userId,
    group: groupId,
    case: "OutOfOffice-" + random,
    assignedBy: pb.authStore.model!.username,
  };
  const result = { message: '', status: '' }
  try {
    await pb.collection("cases").create(data);
    await updateCounter(groupId, userId);
    await createCurrentList(groupId)
    const user = await pb.collection('users').getOne(userId)
    result.message = `${user.fullname} is out of the office and was skipped.`
    result.status = "success"
  } catch (e: any) { result.message = e.message; result.status = "failed" }
  return result
}

export async function getUserCases(userId?: string, group?: string) {
  // console.log("getting cases for user ", userId);
  let cases;
  if (!userId) {
    cases = await pb
      .collection("cases")
      .getList(1, 1000, { expand: "user, group", sort: "-created" });
  } else {
    if (!group) {
      cases = await pb.collection("cases").getList(1, 1000, {
        filter: `user="${userId}"`,
        expand: "user, group",
        sort: "-created",
      });
    } else {
      cases = await pb.collection("cases").getList(1, 1000, {
        filter: `user="${userId}"&&group="${group}"`,
        expand: "user, group",
        sort: "-created",
      });
    }
  }
  return cases;
}

export async function useGetFilteredCases(user?: string, group?: string, pageNumber?:number, perPage?:number) {
  const sorting = "-created"
  if (pageNumber === undefined) pageNumber = 1
  if (perPage === undefined) perPage = 10
  if ((user === undefined || user === '') && (group === undefined) || group === '')
    return await pb.collection('cases').getList(pageNumber, perPage, { expand: "user, group", sort: sorting })
  else if (user === undefined || user === '') return await pb.collection('cases').getList(pageNumber, perPage, { filter: `group="${group}"`, expand: "user, group", sort: sorting })
  else if (group == undefined || group === '') return await pb.collection('cases').getList(pageNumber, perPage, { filter: `user="${user}"`, expand: "user, group", sort: sorting })
  else return await pb.collection('cases').getList(pageNumber, perPage, { filter: `user="${user}"&&group="${group}"`, expand: "user, group", sort: sorting })
}

export async function useUpdateCase(
  recordId: string,
  user: string,
  group: string,
  caseId: string,
  assignedBy: string
) {
  const data = {
    user: user,
    group: group,
    case: caseId,
    assignedBy: assignedBy,
  };
  const result = {
    message: '',
    status: 'success'
  }
  try {
    const res = await pb.collection("cases").update(recordId, data);
    result.message = "Case has been updated."
    return result
  } catch (e: any) {
    result.message = "There is a problem with the update."
    return result
  }
}

export async function useDeleteCase(id: string) {
  const result = { message: "", status: "success" };
  try {
    const caseRecord = await pb.collection("cases").getOne(id)
    const caseId = caseRecord.case
    await pb.collection("cases").delete(id);
    result.message = caseId;
    useRefreshAll();
    return result;
  } catch (e: any) {
    result.status = "failed";
    result.message = e.message;
    return result;
  }
}

export async function useSubmitCase(
  caseId: string,
  user: string,
  group: string
) {
  const res = await useAssignCase(caseId, user, group);
  const result = { message: res.message, status: res.status };
  return result;
}

export async function useRefreshAll() {
  //get groups
  const rec = await pb.collection("groups").getList(1, 100);
  const groups = rec.items;
  //foreach group, get users
  groups.forEach(async (group) => {
    const userRec = await pb
      .collection("users")
      .getList(1, 100, { filter: `memberOf~"${group.id}"` });
    const users = userRec.items;
    //for each user, update counter
    users.forEach(async (user) => {
      await updateCounter(group.id, user.id);
    });
    //createcurrentlist for group
    await createCurrentList(group.id);
  });
}

export async function useGetUsers(group?: string) {
  let users: ListResult
  if (group === null) {
    users = await pb.collection("users").getList()
  } else
    users = await pb
      .collection("users")
      .getList(1, 1000, { filter: `memberOf~"${group}"` });
  return users
}

export async function useGetUsernameFromId(id: string) {
  const res = await pb.collection('users').getOne(id)
  return res.username
}

export async function logActivity(data: LogData) {
  try {
    const res = pb.collection('logs').create(data)
  } catch (e: any) { console.log(e.message) }
}

export async function useDeleteUser(id: string) {
  const result = { message: "", status: "success" };
  try {
    const userRecord = await pb.collection("users").getOne(id)
    const username = userRecord.username
    await pb.collection("users").delete(id);
    result.message = `${username} is deleted`;
    useRefreshAll();
    return result;
  } catch (e: any) {
    result.status = "failed";
    result.message = e.message;
    return result;
  }
}

export async function useCreateUser(userData:userEntry) {
  const result = { status: 'failed', message: '' }
  try {
    const res = await pb.collection('users').create(userData)
    console.log(res)
    result.status = 'success'
    result.message = `User ${userData.fullname.toUpperCase()} has been created.`
  } catch (e: any) { result.message = e.message; result.status = 'failed'; console.log(e) }
  return result
}

export async function useGetGroupName(group:string) {
  try {
    const res = await pb.collection('groups').getOne(group)
    return res.name
  } catch (e) { console.log(e) }
}

export async function useSearchCase(id:string) {
  id = id.trim()
  let result = { message: '', status: 'failed'}
  let data:Record|undefined
  try {
    data = await pb.collection('cases').getFirstListItem(`case="${id}"`, { expand: 'user'})
    result = { message: `Case ${id} found.`, status: 'success'}
  } catch (e:any) { result = { message: e.message, status: "failed"}; data=undefined}
  return { data, result }
}

export async function useCaseExists(id:string) {
  try {
    let res = await pb.collection('cases').getFirstListItem(`case="${id}"`)
    return true
  } catch (e) { return false }
}

export async function useCaseIsEscalated(id:string){
  try {
    let res = await pb.collection('cases').getFirstListItem(`case="${id}-escalated"`)
    return true
  } catch (e) { return false }
}

export async function useEscalateCase(caseId: string, user: string, group: string) { 
  let caseRec = await getCase(caseId.trim())
  await renameOldCase(caseRec)

  const data = {
    user: user,
    group: group,
    case: caseId.trim(),
    assignedBy: pb.authStore.model!.username,
  };

  const result = { message: "", status: "" };
  try {
    await pb.collection("cases").create(data);
    await updateCounter(group, user);
    await createCurrentList(group);
    let owner = (await useGetUsernameFromId(user)).toUpperCase()
    result.message =
      `Case has been escalated. ${owner} should receive a notification shortly.`;
    result.status = "success";
  } catch(e) { result.message = 'Failed to escalate.'
  result.status = 'failed'
  }
  return result
}

async function getCase(id:string) {
  const rec = await pb.collection('cases').getFirstListItem(`case="${id}"`)
  return rec
}

async function renameOldCase(rec:Record) {
  let newCaseId = rec.case+"-escalated"
  rec.case = newCaseId
  const newData = {
    ...rec
  }
  try {
    await pb.collection('cases').update(rec.id,newData)
  } catch (e) { console.log(e) }
}