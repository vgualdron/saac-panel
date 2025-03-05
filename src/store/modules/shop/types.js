export default {
  PATH: '@module/shop',
  actions: {
    LIST_SHOPS: '@actions/listShops',
    SAVE_SHOP: '@actions/saveShop',
    UPDATE_SHOP: '@actions/updateShop',
    DELETE_SHOP: '@actions/deleteShop',
  },
  getters: {
  },
  mutations: {
    SET_SHOPS: '@mutations/setShops',
    SET_SHOP: '@mutations/setShop',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
