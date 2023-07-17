import { emailContent,LogData } from "custom-types";

//const 

export function useGetBooleanFromLocalStorage(value:string|null){
    let result:boolean;
    if(value==='true') result = true
    else result = false
    return result
  }
  
  export async function useSendEmail(email: emailContent) {
    const pb = useNuxtApp().$pb
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
    const pb = useNuxtApp().$pb
    try {
      pb.collection("logs").create(data);
    } catch (e: any) {
      console.log(e.message);
    }
  }