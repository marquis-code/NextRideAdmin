import Swal from "sweetalert2";
const router = useRouter()

export const logOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
      cancelButtonText: "Nah, Just kidding",
    }).then((result) => {
      if (result.value) {
        // localStorage.clear();
        // router.push('/login')
        // window.location.href = "/login"
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nextride_token')
          localStorage.removeItem('nextride_user')
        }
        
        // user.value = null
        
        // Use navigateTo only in client context
        if (typeof window !== 'undefined') {
          // Import navigateTo dynamically to avoid SSR issues
          import('#app').then(({ navigateTo }) => {
            navigateTo('/')
          })
        }
      } else {
        Swal.fire("Cancelled", "Action was cancelled", "info");
      }
    });
  };