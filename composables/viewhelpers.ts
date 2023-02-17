
export function useShowToast(message: string, status: string) {
const toast = useNuxtApp().$toast;
  if (status == "success")
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      hideProgressBar: true,
      
    }) 
    else if (status =="failed")
    toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar: true,
    })

    else toast.warning(message, { 
        position: toast.POSITION.BOTTOM_CENTER,
        hideProgressBar:true,
    })
}
