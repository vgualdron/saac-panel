import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/user/list/${data.displayAll}`,
    method: 'GET',
  }),
  listByNameRole: (data) => http({
    url: `${process.env.URL_API}/api/user/list-by-role-name/${data.status}/${data.roleName}/${data.city}`,
    method: 'GET',
  }),
  listByArea: (data) => http({
    url: `${process.env.URL_API}/api/user/list-by-area/${data.area}`,
    method: 'GET',
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/user/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/user/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/user/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/user/delete/${id}`,
    method: 'DELETE',
  }),
  updateProfile: (data) => http({
    url: `${process.env.URL_API}/api/user/updateProfile/${data.id}`,
    method: 'PUT',
    data,
  }),
  updatePushToken: (data) => http({
    url: `${process.env.URL_API}/api/user/update-push-token`,
    method: 'PUT',
    data,
  }),
  updateLocation: (data) => http({
    url: `${process.env.URL_API}/api/user/update-location`,
    method: 'PUT',
    data,
  }),
  completeData: (data) => http({
    url: `${process.env.URL_API}/api/user/complete-data/${data.id}`,
    method: 'PUT',
    data,
  }),
};
