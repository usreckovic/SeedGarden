import type { PlantModel } from "./plant.model"


export interface PlantDetailsModel extends PlantModel {
    price: number
    currency: string
    category: string
    climate: string
    season: string
    isAvailable: boolean
    stockQuantity: number
    productionDate: string
}