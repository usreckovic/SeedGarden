import type { PlantModel } from "@/models/plant.model"
import axios from "axios"

function randomNumber(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
}


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


        // Sortiranje po nazivu
        // return plants.sort((a, b) => a.name.localeCompare(b.name))

        return plants
    }

}
