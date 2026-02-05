
import Swal from "sweetalert2";

export default function Toast(title, text, icon) {
  return Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  }).fire(title, text, icon);
}
