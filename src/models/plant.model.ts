export interface PlantModel {
    id: number
    name: string
    latinName: string
    description: string
    imageUrl: string
    imageAlt: string
    season: string
    category: string
    price: number
    currency: string
    climate: string
    isAvailable: boolean
    stockQuantity: number
    productionDate: string
}