import Axios from 'axios';

export default class ApiHelper {
  static genericGet(url) {
    return Axios({
      method: 'get',
      url,
    });
  }
}
