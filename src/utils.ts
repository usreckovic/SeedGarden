import Swal, { type SweetAlertResult } from 'sweetalert2'


export function formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

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
        confirmButtonText: 'Yes, confirm!',
        cancelButtonText: 'No, cancel!',
        icon: 'question',
        customClass: bootstrapClasses
    }).then((result : SweetAlertResult) => {
        if (result.isConfirmed) {
            callback()
        }
    })

}