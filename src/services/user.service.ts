import type { OrderModel } from "@/models/order.model";
import type { UserModel } from "@/models/user.model";

const USERS_KEY = 'seedGarden_2026_users'
const ACTIVE_USER_KEY = 'seedGarden_2026_active'

export class UserService{

    static getUsers(): UserModel[]{
        if(localStorage.getItem(USERS_KEY) === null){
            localStorage.setItem(USERS_KEY,JSON.stringify([
            {
                email: 'user@example.com',
                password: 'user123',
                favoritePlant: 'Krompir',
                orders: []
            }
        ]))

        }
        return JSON.parse(localStorage.getItem(USERS_KEY)!)
    }
    






}