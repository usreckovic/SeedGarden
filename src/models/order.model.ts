export interface OrderModel{
    seedId: number
    seedCount: number
    plantPrice: number
    seedNumber?: string
    createdAt: string
    paidAt: string | null
    deletedAt: string | null
}