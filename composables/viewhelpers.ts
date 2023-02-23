
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

export function useFormatDate(date:Date){
  let formatted = new Date(date).toLocaleString(
      'en-us',
      {
          timeStyle: 'medium',
          timeZone: 'Asia/Manila',
          dateStyle: 'medium'
      }
  )
  return formatted
}
