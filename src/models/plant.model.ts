export interface PlantModel {
    id: number
    name: string
    latinName: string
    description: string
    imageUrl: string
    imageAlt: string
    price: number
    currency: string
    category: string
    climate: string
    season: string
    isAvailable: boolean
    stockQuantity: number
    productionDate: string
}