export default {
  PATH: '@module/user',
  actions: {
    LIST_USERS: '@actions/listUsers',
    LIST_USERS_OPTIONS: '@actions/listUsersOptions',
    LIST_USERS_BY_NAME_ROLE: '@actions/listUsersByNameRole',
    LIST_USERS_BY_AREA: '@actions/listUsersByArea',
    GET_USER: '@actions/getUser',
    SAVE_USER: '@actions/saveUser',
    UPDATE_USER: '@actions/updateUser',
    DELETE_USER: '@actions/deleteUser',
    UPDATE_PROFILE: '@actions/updateProfile',
    UPDATE_PUSH_TOKEN: '@actions/updatePushToken',
    COMPLETE_DATA: '@actions/completeData',
  },
  getters: {
  },
  mutations: {
    SET_USERS: '@mutations/setUsers',
    SET_USERS_OPTIONS: '@mutations/setUsersOptions',
    SET_USER: '@mutations/setUser',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
