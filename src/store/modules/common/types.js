export default {
  PATH: '@module/common',
  actions: {
    SIGN_IN: '@actions/signin',
    SIGN_OUT: '@actions/signout',
  },
  getters: {
  },
  mutations: {
    SET_STATUS_SIGN: '@mutations/SetStatusSign',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
    SET_PERMISSIONS: '@mutations/setPermissions',
    SET_MENU: '@mutations/setMenu',
    SET_YARD: '@mutations/setYard',
    SET_CITY: '@mutations/setCity',
    SET_CURRENT_YARD: '@mutations/setCurrentYard',
    SET_NAME: '@mutations/setName',
    SET_DOCUMENT: '@mutations/setDocument',
    SET_TOKEN: '@mutations/setToken',
    SET_ROLES: '@mutations/setRoles',
    SET_ROLES_ARRAY: '@mutations/setRolesArray',
    SET_USER: '@mutations/setUser',
  },
};
