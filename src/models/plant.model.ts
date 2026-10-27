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
    plant_type: string
    target_audience: string
    planting_instructions: string
    light_requirement: string
    intended_use: string
}