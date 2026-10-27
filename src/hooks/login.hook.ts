import { UserService } from "@/services/user.service";
import { useRouter,useRoute } from "vue-router";

export function useLogin(){
    return () => {
        const router = useRouter()
        const route = useRoute()

        if(!UserService.getActiveUser()){
            sessionStorage.setItem('to',route.fullPath)
            router.push('/login')
        }
    }
}