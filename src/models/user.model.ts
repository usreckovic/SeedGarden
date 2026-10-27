import type { OrderModel } from "./order.model";

export interface UserModel {
    email: string
    password: string
    favoritePlant: string
    orders: OrderModel[]
}