import { http } from '../../helpers/http';

export default {
  fetchPoints: (status) => http({
    url: `${process.env.URL_API}/api/point/${status}`,
    method: 'GET',
  }),
  updatePoint: (data) => http({
    url: `${process.env.URL_API}/api/point/${data.id}`,
    method: 'PUT',
    data,
  }),
};
