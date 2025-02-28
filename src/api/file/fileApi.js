import { http } from '../../helpers/http';

export default {
  save: (data) => http({
    url: `${process.env.URL_API}/api/file/create`,
    method: 'POST',
    data,
  }),
  get: (data) => http({
    url: `${process.env.URL_API}/api/file/get`,
    method: 'POST',
    data,
  }),
  listStatusesToday: () => http({
    url: `${process.env.URL_API}/api/file/list-statuses-today`,
    method: 'GET',
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/file/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/file/delete/${id}`,
    method: 'DELETE',
  }),
};
