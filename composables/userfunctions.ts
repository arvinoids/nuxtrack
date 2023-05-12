import PocketBase, { ListResult } from "pocketbase";
import { userEntry, userStatus, statuschoice } from "custom-types";
const pb = new PocketBase("https://solutionsteam.lrdc.lexmark.com/pb/");
pb.autoCancellation(false);

export async function useDeleteUser(id: string) {
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

export async function useGetUsers(group?: string) {
    let users: ListResult;
    if (group === null) {
        users = await pb.collection("users").getList();
    } else
        users = await pb
            .collection("users")
            .getList(1, 1000, { filter: `memberOf~"${group}"` });
    return users;
}

export async function useGetUsernameFromId(id: string) {
    const res = await pb.collection("users").getOne(id);
    return res.username;
}

export async function useGetUserStatus(id: string) {
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

export async function useChangeUserStatus(id:string,newStatus:statuschoice,newMessage:string|null) {
    try {
        const record = await pb.collection('users').update(id,{ 'status':newStatus, 'statusmessage':newMessage})
    } catch (e) {
        console.log(e)
     }
}