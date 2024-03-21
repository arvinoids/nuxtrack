
export function useShowToast(message: string, status: string) {
  const toast = useNuxtApp().$toast;
  if (status == "success")
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      hideProgressBar: true,
      toastStyle: {
        fontFamily: "Inter",
        borderRadius: '0px',
      }

    })
  else if (status == "failed")
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 5000,
      toastStyle: {
        fontFamily: "Inter",
        borderRadius: '0px',
      }
    })

  else toast.warning(message, {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 5000,
    hideProgressBar: true,
    toastStyle: {
      fontFamily: "Inter",
      borderRadius: '0px',
    }
  })
}

export function useFormatDate(date: Date) {
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

export function getColor(status: string) {
  const choices = STATUS_CHOICES
  for (const choice of choices) {
    if (choice.status === status) {
      return choice.color;
    }
  }
  return "gray-500";
}

// for mini toast
import { useNotifications } from "./states";
const notifications = useNotifications()

export function miniToast(status:'success'|'failed'|'warning',message:string) {
  notifications.value = [{status,message}, ...notifications.value]
  setTimeout(removeToast, 3000)
}

export function removeToast() {
  notifications.value = [...notifications.value.slice(0, notifications.value.length - 1)]
}

