export type OrderStatus = 'rezervisano' | 'pristiglo' | 'otkazano'

export interface OrderModel{
    seedId: number
    seedCount: number
    pricePerSeed: number
    createdAt: string
    status: OrderStatus
    seedNumber?: string
    rating?: number
    review?: string
}