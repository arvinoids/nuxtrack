import { defineRule } from "vee-validate";
import { required, email, min } from '@vee-validate/rules';

export default defineNuxtPlugin((nuxtApp) => {
    defineRule('required', required)
    defineRule('email', email)
    defineRule('min', min)
    defineRule('confirmed', (value:string, target:string []) => {
        if (value === target[0]) {
          return true;
        }
        return 'Passwords must match';
      });
})