import { http } from '../../helpers/http';

export default {
  list: (status) => http({
    url: `${process.env.URL_API}/api/shop/by-status/${status}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/shop`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/shop/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/shop/${id}`,
    method: 'DELETE',
  }),
};
