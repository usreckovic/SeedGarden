import type { OrderModel, OrderStatus } from "@/models/order.model";
import type { UserModel } from "@/models/user.model";

const USERS_KEY = 'seedGarden_2026_users'
const ACTIVE_USER_KEY = 'seedGarden_2026_active'

export class UserService {

    static setOrderStatus(createdAt: string, status: OrderStatus) {
        const activeUser = this.getActiveUser()
        const users = this.getUsers()

        if (activeUser) {
            for (let user of users) {
                if (user.email === activeUser.email) {
                    for (let order of user.orders) {
                        if (order.createdAt === createdAt) {
                            order.status = status
                        }
                    }
                }
            }

            localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
    }

    static setOrderCount(createdAt: string, seedCount: number) {
        const activeUser = this.getActiveUser()
        const users = this.getUsers()

        if (activeUser) {
            for (let user of users) {
                if (user.email === activeUser.email) {
                    for (let order of user.orders) {
                        if (order.createdAt === createdAt) {
                            order.seedCount = seedCount
                        }
                    }
                }
            }

            localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
    }

    static getUsers(): UserModel[] {
        if (localStorage.getItem(USERS_KEY) === null) {
            localStorage.setItem(USERS_KEY, JSON.stringify([
                {
                    firstName: 'Jovan',
                    lastName: 'Jovanovic',
                    phone: '123456789',
                    address: 'Zbun 23',
                    email: 'user@example.com',
                    password: 'user123',
                    favoritePlantCategory: 'Voće',
                    orders: []
                }
            ]))

        }
        return JSON.parse(localStorage.getItem(USERS_KEY)!)
    }

    static login(email: string, password: string): boolean {
        const users = this.getUsers()

        for (let user of users) {
            if (user.password == password && user.email == email) {
                localStorage.setItem(ACTIVE_USER_KEY, email)
                return true
            }
        }
        return false
    }

    static getActiveUser(): UserModel | null {
        for (let user of this.getUsers()) {
            if (user.email == localStorage.getItem(ACTIVE_USER_KEY)) {
                return user
            }
        }
        return null
    }

    static logout() {
        localStorage.removeItem(ACTIVE_USER_KEY)
    }

    static addOrder(order: OrderModel) {
        const activeUser = this.getActiveUser()
        const users = this.getUsers()

        if (activeUser) {
            for (let user of users) {
                if (user.email == activeUser.email) {
                    user.orders.push(order)
                }
            }

            localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
    }

    static removeOrder(order: OrderModel) {
        const activeUser = this.getActiveUser()
        const users = this.getUsers()

        if (activeUser) {
            for (let user of users) {
                if (user.email === activeUser.email) {
                    user.orders = user.orders.filter(o => o.createdAt !== order.createdAt)
                }
            }

            localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
    }

    static changePassword(newPassword: string) {
        const activeUser = this.getActiveUser()
        const users = this.getUsers()

        if (activeUser) {
            for (let user of users) {
                if (user.email === activeUser.email) {
                    user.password = newPassword
                }
            }

            localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
    }

    static createUser(email: string, password: string, firstName: string, lastName: string, phone: string, address: string, favoritePlantCategory: string) {

        const users = this.getUsers()

        for (let user of users) {
            if (user.email === email) {
                return "Email vec iskoriscen."
            }
        }

        if (password.length < 8) {
            return "Sifra mora biti duza od 8 slova."
        }

        users.push({
            email, password, firstName, lastName, phone, address, favoritePlantCategory, orders: []
        })

        localStorage.setItem(USERS_KEY, JSON.stringify(users))
        return null
    }

    static updateUser(updated: UserModel, emailOld: string): string | null {
        const users = this.getUsers()

        for (let u of users) {
            if (u.email === updated.email && u.email !== emailOld) {
                return "Email je vec iskoricen."
            }
        }

        for (let user of users) {
            if (user.email === emailOld) {
                user.firstName = updated.firstName
                user.lastName = updated.lastName
                user.email = updated.email
                user.phone = updated.phone
                user.address = updated.address
                user.favoritePlantCategory = updated.favoritePlantCategory
            }
        }

        localStorage.setItem(USERS_KEY, JSON.stringify(users))
        localStorage.setItem(ACTIVE_USER_KEY, updated.email)
        return null
    }

    static setOrderReview(createdAt: string, rating: number, review: string) {
    const activeUser = this.getActiveUser()
    const users = this.getUsers()

    if (activeUser) {
        for (let user of users) {
            if (user.email === activeUser.email) {
                for (let order of user.orders) {
                    if (order.createdAt === createdAt && order.status === 'pristiglo') {
                        order.rating = rating
                        order.review = review
                    }
                }
            }
        }

        localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
}

static getReviewsForPlant(seedId: number) {
    const reviews: { name: string, rating: number, review: string }[] = []

    for (let user of this.getUsers()) {
        for (let order of user.orders) {
            if (order.seedId === seedId && order.status === 'pristiglo' && order.rating) {
                reviews.push({
                    name: user.firstName + ' ' + user.lastName,
                    rating: order.rating,
                    review: order.review ?? ''
                })
            }
        }
    }

    return reviews
}

static getAverageRating(seedId: number): number {
    const reviews = this.getReviewsForPlant(seedId)

    if (reviews.length === 0) {
        return 0
    }

    let sum = 0
    for (let r of reviews) {
        sum += r.rating
    }

    return sum / reviews.length
}
}