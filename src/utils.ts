import Swal, { type SweetAlertResult } from 'sweetalert2'
import type { OrderModel } from './models/order.model'


const bootstrapClasses = {
    popup: 'card',
    cancelButton: 'btn btn-danger',
    denyButton: 'btn btn-secondary',
    confirmButton: 'btn btn-primary'
}

export function showConfirm(message: string, callback: Function) {
    Swal.fire({
        title: message,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Da, Potvrdi!',
        cancelButtonText: 'Ne, odustani!',
        icon: 'question',
        customClass: bootstrapClasses
    }).then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
            callback()
        }
    })

}

export function showError(messege: string) {
    Swal.fire({
        icon: 'error',
        title: 'Greska',
        text: messege,
        customClass: bootstrapClasses
    })
}

export function formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function getPriceForSeed(order:OrderModel){
    return order.pricePerSeed * order.seedCount
}

export function showLoading(){
    Swal.fire({
        title: 'Ucitavanje podataka',
        text: 'Sacekajte da uzmemo poslednje podatke',
        customClass: bootstrapClasses,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
        }
    })
}