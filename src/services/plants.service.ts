import type { PlantDetailsModel } from "@/models/plant-details.model";
import type { PlantModel } from "@/models/plant.model"
import axios from "axios"

const client = axios.create({
    baseURL: 'https://plants.pequla.com/api/plants/',
    headers: {
        'Accept': 'application/json',
        'X-Name': 'PKI-2026'
    }
})


export class PlantService {
    static async getPlants(): Promise<PlantModel[]> {
        const rsp = await axios.request({
            method: 'GET',
            url: 'https://plants.pequla.com/api/plants',
            headers: {
                'Accept': 'application/json'
            }
        })


        const plants: PlantModel[] = []

        for (let obj of rsp.data) {
            plants.push({
                id: obj.id,
                name: obj.name,
                latinName: obj.latin_name,
                description: obj.description,
                imageUrl: obj.image_url,
                imageAlt: obj.image_alt,
                price: obj.price,
                currency: obj.currency,
                category: obj.category,
                climate: obj.climate,
                season: obj.season,
                isAvailable: obj.is_available,
                stockQuantity: obj.stock_quantity,
                productionDate: obj.production_date
            })
        }

        return plants
    }

    static async getPlantById(id: number) {
        const details = await client.get(`/${id}`);

        return {
            id: details.data.id,
            name: details.data.name,
            latinName: details.data.latin_name,
            description: details.data.description,
            imageUrl: details.data.image_url,
            imageAlt: details.data.image_alt,
            price: details.data.price,
            currency: details.data.currency,
            category: details.data.category,
            climate: details.data.climate,
            season: details.data.season,
            isAvailable: details.data.is_available,
            stockQuantity: details.data.stock_quantity,
            productionDate: details.data.production_date
        };
    }

    static async getPlantsByCategory(category: string) {
        const rsp = await client.get('')
        const plants: PlantDetailsModel[] = []

        for (let obj of rsp.data) {
            if (obj.category === category) {
                plants.push({
                    id: obj.id,
                    name: obj.name,
                    latinName: obj.latin_name,
                    description: obj.description,
                    imageUrl: obj.image_url,
                    imageAlt: obj.image_alt,
                    price: obj.price,
                    currency: obj.currency,
                    category: obj.category,
                    climate: obj.climate,
                    season: obj.season,
                    isAvailable: obj.is_available,
                    stockQuantity: obj.stock_quantity,
                    productionDate: obj.production_date
                })
            }
        }

        return plants
    }
}


