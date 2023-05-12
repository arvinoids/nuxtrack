import PocketBase, { ListResult, Record } from "pocketbase";

// //const cnf = useRuntimeConfig().public;
const pb = new PocketBase("https://solutionsteam.lrdc.lexmark.com/pb/");
// const pb = useNuxtApp().$pb
pb.autoCancellation(false);

// When the dashboard loads, the system looks for users under each group from the currentlist collection.
//If there are no users, the system creates the currentlist by running a query from the counter sorted by count.

//The counter collection contains the count of cases for each user under a group.

//We need a way to refresh the counter every time changes are made.

async function updateCounter(group: string, user: string) {
  let newCount = await getCount(user, group);
  // console.log("new count: ", newCount);
  let data = {
    user: user,
    group: group,
    count: newCount,
  };
  let record;
  try {
    record = await pb
      .collection("counter")
      .getFirstListItem(`group="${group}"&&user="${user}"`);
  } catch {
    console.log("No record in counter yet");
  }

  // console.log("counter record ", record);
  if (record !== undefined) {
    let res = await pb.collection("counter").update(record.id, data);
    // console.log("result", res);
  }
}

async function getCount(user: string, group: string) {
  // const groupFilter = createFilter("group", group);
  // const userFilter = createFilter("user", user);
  const res = await pb.collection("cases").getList(1, 10000, {
    filter: `group="${group}"&&user="${user}"`,
    $autoCancel: false,
  });
  return res.totalItems;
}

export async function useAssignCase(
  caseId: string,
  user: string,
  group: string
) {
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
    let owner = (await useGetUsernameFromId(user)).toUpperCase();
    result.message = `Case has been assigned. ${owner} should receive a notification shortly.`;
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

export async function useSkipOut(userId: string, groupId: string) {
  const data = {
    user: userId,
    group: groupId,
    case: generateDummyCase('OutOfOffice-'),
    assignedBy: pb.authStore.model!.username,
  };
  const result = { message: "", status: "" };
  try {
    await pb.collection("cases").create(data);
    await updateCounter(groupId, userId);
    // await createCurrentList(groupId)
    const user = await pb.collection("users").getOne(userId);
    result.message = `${user.fullname} is out of the office and was skipped.`;
    result.status = "success";
  } catch (e: any) {
    result.message = e.message;
    result.status = "failed";
  }
  return result;
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

export async function useGetFilteredCases(
  user?: string,
  group?: string,
  pageNumber?: number,
  perPage?: number
) {
  const sorting = "-created";
  if (pageNumber === undefined) pageNumber = 1;
  if (perPage === undefined) perPage = 10;
  if (
    ((user === undefined || user === "") && group === undefined) ||
    group === ""
  )
    return await pb
      .collection("cases")
      .getList(pageNumber, perPage, { expand: "user, group", sort: sorting });
  else if (user === undefined || user === "")
    return await pb
      .collection("cases")
      .getList(pageNumber, perPage, {
        filter: `group="${group}"`,
        expand: "user, group",
        sort: sorting,
      });
  else if (group == undefined || group === "")
    return await pb
      .collection("cases")
      .getList(pageNumber, perPage, {
        filter: `user="${user}"`,
        expand: "user, group",
        sort: sorting,
      });
  else
    return await pb
      .collection("cases")
      .getList(pageNumber, perPage, {
        filter: `user="${user}"&&group="${group}"`,
        expand: "user, group",
        sort: sorting,
      });
}

export async function useGetFilteredLogs(
  type?: string,
  pageNumber?: number,
  perPage?: number
) {
  const sorting = "-created";
  if (pageNumber === undefined) pageNumber = 1;
  if (perPage === undefined) perPage = 10;
  try {
    if (type === undefined || type === "")
      return await pb
        .collection("logs")
        .getList(pageNumber, perPage, { sort: sorting });
    else
      return await pb
        .collection("logs")
        .getList(pageNumber, perPage, {
          filter: `type="${type}"`,
          sort: sorting,
        });
  } catch (e) {
    console.log(e);
  }
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
    message: "",
    status: "success",
  };
  try {
    const res = await pb.collection("cases").update(recordId, data);
    result.message = `Case ${caseId} has been updated.`;
    return result;
  } catch (e: any) {
    result.message = "There is a problem with the update - " + e.message;
    return result;
  }
}

export async function useDeleteCase(id: string) {
  const result = { message: "", status: "success" };
  try {
    const caseRecord = await pb.collection("cases").getOne(id);
    const caseId = caseRecord.case;
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
  });
}

export async function useGetGroupName(group: string) {
  try {
    const res = await pb.collection("groups").getOne(group);
    return res.name;
  } catch (e) {
    console.log(e);
  }
}

export async function useSearchCase(id: string) {
  id = id.trim();
  let result = { message: "", status: "failed" };
  let data: Record | undefined;
  try {
    data = await pb
      .collection("cases")
      .getFirstListItem(`case="${id}"`, { expand: "user" });
    result = { message: `Case ${id} found.`, status: "success" };
  } catch (e: any) {
    result = { message: e.message, status: "failed" };
    data = undefined;
  }
  return { data, result };
}

export async function useCaseExists(id: string) {
  try {
    let res = await pb.collection("cases").getFirstListItem(`case="${id}"`);
    return true;
  } catch (e) {
    return false;
  }
}

export async function useCaseIsEscalated(id: string) {
  try {
    let res = await pb
      .collection("cases")
      .getFirstListItem(`case="${id}-escalated"`);
    return true;
  } catch (e) {
    return false;
  }
}

export async function useEscalateCase(
  caseId: string,
  user: string,
  group: string
) {
  let caseRec = await getCase(caseId.trim());
  await renameOldCase(caseRec);

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
    // await createCurrentList(group);
    let owner = (await useGetUsernameFromId(user)).toUpperCase();
    result.message = `Case has been escalated. ${owner} should receive a notification shortly.`;
    result.status = "success";
  } catch (e) {
    result.message = "Failed to escalate.";
    result.status = "failed";
  }
  return result;
}

async function getCase(id: string) {
  const rec = await pb.collection("cases").getFirstListItem(`case="${id}"`);
  return rec;
}

async function renameOldCase(rec: Record) {
  let newCaseId = rec.case + "-escalated";
  rec.case = newCaseId;
  const newData = {
    ...rec,
  };
  try {
    await pb.collection("cases").update(rec.id, newData);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Reassigns cases before deleting the user.
 */
export async function useReassignCases(oldUser: string, newUser: string) {
  const res = { message: "Reassign failed", status: "failed" };
  const userCases = await pb
    .collection("cases")
    .getList(1, 10000, { filter: `user="${oldUser}"` });
  const newUserName = await useGetUsernameFromId(newUser);
  if (userCases.totalItems > 0) {
    userCases.items.forEach(async (item) => {
      const data = {
        user: newUser,
        group: item.group,
        case: item.case,
        assignedBy: item.assignedBy,
      };
      try {
        const rec = await pb.collection("cases").update(item.id, data);
        res.message = `Cases assigned to user ${newUserName}.`;
        res.status = "success";
      } catch (e) {
        console.log(e);
      }
    });
  } else {
    res.message = "No cases to reassign.";
    res.status = "success";
  }
  return res;
}

async function removeCounters(userId: string) {
  // remove items with matching user id
  const res = { message: "Unable to remove counters", status: " failed" };
  const countersData = await pb
    .collection("counter")
    .getList(1, 100, { filter: `user="${userId}"` });
  try {
    countersData.items.forEach(async (item) => {
      await pb.collection("counter").delete(item.id);
    });
  } catch (e: any) {
    res.message = e.message;
    res.status = "success";
  }
  return res;
}

async function removeLists(userId: string) {
  const res = { message: "Unable to remove from lists", status: " failed" };
  const listsData = await pb
    .collection("currentlist")
    .getList(1, 100, { filter: `user="${userId}"` });
  try {
    listsData.items.forEach(async (item) => {
      await pb.collection("currentlist").delete(item.id);
    });
  } catch (e: any) {
    res.message = e.message;
    res.status = "success";
  }
  return res;
}

export async function useRemoveUserFromGroups(id: string) {
  const res = { message: "Remove failed", status: "failed" };
  // const user = await pb.collection('users').getOne(id)
  try {
    await removeCounters(id);
    await removeLists(id);
    await pb.collection("users").update(id, { memberOf: [""] });
    res.message = "User has been removed from all groups";
    res.status = "success";
  } catch (e: any) {
    res.message = e.message;
  }
  return res;
}



export async function useMakeCounter(group: string, users: ListResult) {
  users.items.forEach(async (user) => {
    const count = (
      await pb
        .collection("cases")
        .getList(1, 10000, { filter: `user="${user.id}"&&group="${group}"` })
    ).totalItems;
    let data = {
      user: user.id,
      group,
      count,
    };
    console.log("counter data", data);
    const oldCounter = await pb
      .collection("counter")
      .getList(1, 1, { filter: `user="${user.id}"&&group="${group}"` });
    if (oldCounter.totalItems === 1) {
      await pb.collection("counter").delete(oldCounter.items[0].id);
    }
    // create new counter
    const res = await pb.collection("counter").create(data);
    console.log("create result", res);
  });
}

export async function useUpdateCounter(group: string, users: ListResult) {
  users.items.forEach(async (user) => {
    const oldCounter = await pb
      .collection("counter")
      .getFirstListItem(`user="${user.id}" && group="${group}"`);
    let newCount = countCases(user.id, group);
    let data = {
      user: user.id,
      group,
      count: newCount,
    };
  });
}

async function countCases(user: string, group: string) {
  const res = await pb
    .collection("cases")
    .getList(1, 10000, { filter: `user="${user}"&&group="${group}"` });
  return res.totalItems;
}

// export async function useUpdateCurrentList(group: string) {
//   const counter = await pb.collection('counter').getList(1, 1000, { filter: `group="${group}"`, sort: "+count" })
// }

export async function useFindCase(id: string) {
  const res = {
    message: "",
    status: "",
  };
  let data:Record|null;

  try {
    data = await pb
      .collection("cases")
      .getFirstListItem(`case="${id.trim()}"`,{ expand: "user,group"});
    res.message = "Case found";
    res.status = "success";
  } catch (e: any) {
    res.message = "The case does not exist in the database";
    data = null
    res.status = 'failed'
  }
  return { res, data };
}

function generateDummyCase(prefix:string){
  const random = Math.random().toString(36).substring(3, 9);
  const caseId:string = prefix + random
  return caseId
}

export function useCreateDummyCases(quantity:number,prefix:string) {
  let cases:string[]=[]
  while (quantity>0) {
    cases.push(generateDummyCase(prefix))
    quantity--
  }
  return cases
}