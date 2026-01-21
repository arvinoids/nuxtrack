import type { SettingsResponse } from "~/pocketbase-types";

async function useGetAllSettings() {
    const pb = useNuxtApp().$pb
    const settings = await pb.collection("settings").getFullList<SettingsResponse>();
    return settings;
}

export async function useGlobalStatusMessage(){
    const settings = await useGetAllSettings();
    const globalStatusMessage = settings.find(setting => setting.field === "global_status_message");
    return globalStatusMessage?.value==="true" ? true : false;
}