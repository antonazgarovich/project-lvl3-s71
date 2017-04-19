import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

const axiosSetting = (host) => {
  if (host) {
    axios.defaults.host = host;
    axios.defaults.adapter = httpAdapter;
  }
  return axios;
};

export default axiosSetting;
