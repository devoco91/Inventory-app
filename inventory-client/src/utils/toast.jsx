import { toast } from 'react-toastify';

export const showToast = (msg, type = 'success') => {
  toast[type](msg);
};
