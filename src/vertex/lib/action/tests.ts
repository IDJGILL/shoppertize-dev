import { addToCart } from "~/vertex/modules/cart/cart-actions"
import { useActionHandler } from "./hook"

const useActionTestHook = () => {
  const {} = useActionHandler(addToCart, {
    onSuccess: (response) => {
      response.data
    },

    onError: (e) => {
      console.log(e)
    },
  })
}
