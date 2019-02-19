import { toast, Slide } from 'react-toastify';

const options = {
  position: "bottom-left",
  hideProgressBar: true,
  transition: Slide,
  pauseOnHover: false,
}

const successNotify = () => {
  toast.success("Email Sent!", {
    ...options
  });
}

const warnNotify = () => {
  toast.warn("Warning!", {
    ...options
  });
}

const errorNotify = () => {
  toast.error("Error!", {
    ...options
  });
}

const deleteNotify = () => {
  toast.error("Email Deleted!", {
    ...options
  });
}

const infoNotify = () => {
  toast.info("Email Sent!", {
    ...options});
}

export {
  successNotify,
  warnNotify,
  errorNotify,
  deleteNotify,
  infoNotify
}
