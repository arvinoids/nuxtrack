import PocketBase from 'pocketbase';
import { emailContent,LogData } from "custom-types";

const pb = new PocketBase("https://solutionsteam.lrdc.lexmark.com/pb/");
//const pb = await useNuxtApp().$pb

export function useGetBooleanFromLocalStorage(value:string|null){
    let result:boolean;
    if(value==='true') result = true
    else result = false
    return result
  }
  
  export async function useSendEmail(email: emailContent) {
    const enabled = await pb
      .collection("settings")
      .getFirstListItem(`field="emailnotification"`);
    if (enabled.value === "false") {
      return {
        message: "Email notifications are currently disabled.",
        status: "warn",
      };
    }
    const emailurl = (
      await pb.collection("settings").getFirstListItem(`field="emailservice"`)
    ).value;
    const token = (
      await pb.collection("settings").getFirstListItem(`field="emailtoken"`)
    ).value;
    const res = await $fetch(emailurl, {
      method: "POST",
      body: email,
      headers: {
        Authorization: token,
      },
    });
    return res;
  }

  export async function logActivity(data: LogData) {
    try {
      const res = pb.collection("logs").create(data);
    } catch (e: any) {
      console.log(e.message);
    }
  }