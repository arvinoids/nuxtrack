import type { ListResult,RecordModel } from "pocketbase";
import type { userEntry, userStatus, statuschoice } from "custom-types";
import type { expandedUsers,user } from "pocketbase-types";
// const pb = new PocketBase("https://solutionsteam.lrdc.lexmark.com/pb/");
//pb.autoCancellation(false);

export function useCurrentUser() {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    return pb.authStore.model
}

export async function useDeleteUser(id: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const result = { message: "", status: "success" };

    try {
        const userRecord = await pb.collection("users").getOne(id);
        const username = userRecord.username;
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

export async function useCreateUser(userData: userEntry) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const result = { status: "failed", message: "" };
    try {
        const res = await pb.collection("users").create(userData);
        result.status = "success";
        result.message = `User ${userData.fullname.toUpperCase()} has been created.`;
    } catch (e: any) {
        result.message = e.message;
        result.status = "failed";
        console.log(e);
    }
    return result;
}

export async function useUpdateUser(id: string, userData: {
    email?: string,
    password?: string,
    passwordConfirm?: string,
    fullname?: string,
    memberOf?: string[],
    role?: "user" | "admin" | "lead",
}) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const result = { status: "failed", message: "" };
    try {
        await pb.collection("users").update(id, userData);
        result.status = "success";
        result.message = `User ${userData.fullname!.toUpperCase()} has been updated.`;
    } catch (e: any) {
        result.message = e.message;
        result.status = "failed";
        console.log(e);
    }
    return result;
}

export async function useGetUsersOfGroup(group?: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    let users: ListResult<user>;
    if (group === null) {
        users = await pb.collection("users").getList();
    } else
        users = await pb
            .collection("users")
            .getList(1, 1000, { filter: `memberOf~"${group}"`, sort:'+last_assigned,+username' });
    return users;
}

export async function useGetUserGroups(id: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const res = await pb.collection("users").getOne(id);
    return res.memberOf;
}

export async function useGetUsernameFromId(id: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const res = await pb.collection("users").getOne(id, { fields: 'username' });
    return res.username;
}

export async function useGetUserStatus(id: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const status: userStatus = {
        status: 'Unknown',
        message: ''
    }
    try {
        const res = await pb.collection('users').getOne(id)
        status.status = res.status
        status.message = res.statusmessage
    } catch (e: any) {
        console.log(e)
    }
    return status
}

export async function useChangeUserStatus(id: string, newStatus: statuschoice, newMessage: string | null) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    try {
        const record = await pb.collection('users').update(id, { 'status': newStatus, 'statusmessage': newMessage })
    } catch (e) {
        console.log(e)
    }
}

export async function useGetAllUsers() {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    let users: ListResult<user>;
    users = await pb.collection("users").getList(1, 1000, { expand: 'memberOf', sort: 'fullname' })
    return users
}

/** Get users of a group sorted by count ascending */
export async function useGetSortedUsers(group: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    // first check if user list is still the same
    await cleanUpCounter(group);
    const users = await pb
        .collection("counter")
        .getList(1, 50, { filter: `group="${group}"`, sort: "+count", expand: "user" });
    return (users as unknown) as expandedUsers;
}

async function userGoesOnLeave(user: string, group: string) {
    // if user is top of list, then just get top count upon return and assign as the count of the user
    // if user is not on top, get difference from top, store in db, then add difference to user's count upon return
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const sortedUsers = await useGetSortedUsers(group).then((res) => res.items);
    const userPosition = sortedUsers.findIndex((item) => user === item.user);
    const difference = await savedDifference(user, group)
    await storeUserCount(user, group, userPosition, difference);
}

async function userIsBackFromLeave(userId: string, group: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    await useRefreshGroupCounter(group);
    const userLeaveRecord = await pb.collection("leaves").getFirstListItem(`user="${userId}"&&group="${group}"`);
    const sortedUsers = await useGetSortedUsers(group);
    let casesToAdd: number
    if (sortedUsers.items.length === 2) {
        if (userLeaveRecord.position === 0) {
            casesToAdd = sortedUsers.items[1].count - sortedUsers.items[0].count - userLeaveRecord.difference
        } else {
            casesToAdd = userLeaveRecord.difference - sortedUsers.items[1].count + sortedUsers.items[0].count

        }
    }
    else {
        casesToAdd = userLeaveRecord.difference - ((sortedUsers.items[userLeaveRecord.position].count) - sortedUsers.items[0].count)
    }
    await useAddDummyCases(casesToAdd, userId, group, "Leave")
    pb.collection('leaves').update(userLeaveRecord.id, { active: false })
    await useRefreshGroupCounter(group);
}

async function savedDifference(user: string, group: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const sortedUsers = await useGetSortedUsers(group).then((res) => res.items);
    const users = sortedUsers.length
    const userPosition = sortedUsers.findIndex((item) => user === item.user);
    let difference: number
    if (users === 2) difference = Math.abs(sortedUsers[0].count - sortedUsers[1].count)
    else {
        difference = sortedUsers[userPosition].count - sortedUsers[0].count
    }
    return difference
}


async function storeUserCount(user: string, group: string, position: number, difference: number) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    await pb.collection("leaves").create({
        user,
        difference,
        group,
        position,
        active: true
    });
}

export async function useUserOnLeave(id: string) {
    const groups = await useGetUserGroups(id);
    groups.forEach(async (group: string) => {
        await userGoesOnLeave(id, group);
    });
}

export async function useUserIsBackFromLeave(id: string) {
    const groups = await useGetUserGroups(id);
    try {
        groups.forEach(async (group: string) => {
            await userIsBackFromLeave(id, group);
        });
        return { status: 'success', message: 'updated user case count after leave' }
    } catch (e: any) {
        return {
            status: 'failed',
            message: e.message
        }
    }
}

export async function useGetUserById(id: string) {
    const pb = useNuxtApp().$pb
    const user = await pb.collection("users").getOne(id);
    return user
}

export async function useGetUserByUsername(username: string) {
    const pb = useNuxtApp().$pb
    const user = await pb.collection("users").getFirstListItem(`username="${username}"`);
    return user
}

/** Cleans up the counter so that users who are no longer in the group are deleted. */
async function cleanUpCounter(group: string) {
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const groupUsers = await pb.collection("users").getList(1, 100, { filter: `memberOf~"${group}"` }).then((res) => res.items)
    const users = groupUsers.map((user) => user.id)
    const groupCounterUsers = await pb.collection("counter").getList(1, 1000, { filter: `group="${group}"` });

    // use for each user of groupCounterUsers to check if user is in counter, if not, delete from counter
    for (let user of groupCounterUsers.items) {
        if (!users.includes(user.user)) {
            const counter = await pb.collection('counter').getFirstListItem(`user="${user.user}"&&group="${group}"`)
            await pb.collection("counter").delete(counter.id);
        }
    }
}

/** Takes a groupId and retrieve the users in that group, then it creates the usersequence or retrieves the existing entry
 * @returns an array of users
 */
export async function getOrderedUsers(groupId: string) {
    const pb = useNuxtApp().$pb;
    let groupUsers = await pb.collection("users").getList(1, 100, { filter: `memberOf~"${groupId}"` }).then((res) => res.items)
    let storedSequence;
    let orderedUsers;
    let usersData:user[]=[];
    try {
        storedSequence = await pb
            .collection("usersequence")
            .getFirstListItem(`group="${groupId}"`);
        orderedUsers = storedSequence.user_order;
    } catch {
        const usersequence = groupUsers.map((item) => item.id);
        const res = await pb
            .collection("usersequence")
            .create({ group: groupId, user_order: usersequence });
        orderedUsers = res.user_order;
    }

    for (let user of orderedUsers) {
        let userInfo = groupUsers.find((item) => item.id === user) as unknown as user;
        usersData.push(userInfo);
    }
    return usersData
}

/** Takes a list of users with data and returns an array of userIds*/
export function getOrderedUserIds(users:user[]){
    let userIds:string[]=[];
    for(let user of users){
        userIds.push(user.id);
    }
    return userIds;
}

/** Takes a list of users and a userId and moves the user to the bottom of the list
 * @returns an array of users with the user moved to the bottom of the list.
 */
export async function useMoveUserToBottom(users:string[],userIdToMove:string){
      // Find the index of the string
  const index = users.indexOf(userIdToMove);
  // If the item is in the array, move it to the end
  if (index > -1) {
    users.push(users.splice(index, 1)[0]);
  }
  return users;
}

/** Updates the usersequence for the group
 * @returns the updated sequence record
 */
export async function useUpdateUserSequence(groupId: string, newSequence: string[]) {
    const pb = useNuxtApp().$pb;
    const record = await useGetUserSequenceData(groupId);
    const res = await pb.collection("usersequence").update(record.id, { user_order: newSequence });
    return res;
}

/** Retrieves the user sequence record using the groupId */
export async function useGetUserSequenceData(groupId:string){
    const pb = useNuxtApp().$pb;
    const res = await pb.collection("usersequence").getFirstListItem(`group="${groupId}"`);
    return res as sequence;
}

/** Moves a userid to the start of the array
 * @returns the updated sequence record
 */
export async function useMoveUserToTop(oldSequence:string[],userIdToMove:string) {
    const newSequence = oldSequence.filter((id) => id !== userIdToMove);
    newSequence.unshift(userIdToMove);
    return newSequence;
}
export async function useUpdateUserLastAssigned(userId:string) {
    const pb = useNuxtApp().$pb;
    const userData = await pb.collection('users').getOne(userId,{fields:'last_assigned'})
    const res = await pb.collection("users").update(userId, { last_assigned: new Date(), last_assigned_previous:userData.last_assigned });
    return res;
}

export async function useRevertLastAssigned(userId:string){
    const pb = useNuxtApp().$pb
    pb.autoCancellation(false);
    const user = await pb.collection("users").getOne(userId);
    await pb.collection('users').update(userId, {
      last_assigned:user.last_assigned_previous,last_assigned_previous:null
    })
  }
  

type sequence = RecordModel&{ group:string, user_order:string[]}
