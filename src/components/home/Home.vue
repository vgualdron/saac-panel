<template>
  <div class="q-pa-md text-center" justify-center items-center>
    <div class="justify-center q-mt-sm">
      Bienvenidos ... <br> {{ versionApp }} <br>
    </div>
    <img src="../../assets/logo-rectangle.png" width="500" class="q-mx-auto q-my-md">
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import notificationTypes from '../../store/modules/notification/types';
import userTypes from '../../store/modules/user/types';
import { showNotifications } from '../../helpers/showNotifications';

export default {
  data() {
    return {
      myTokenPush: '',
      userId: 'f2f506fe-1afa-46ad-a60c-299f17c2a6ea',
      title: 'Titulo',
      content: 'Contenido',
      url: 'https://documentation.onesignal.com/docs/permission-requests',
      subscribed: false,
    };
  },
  props: [],
  computed: {
    ...mapState(notificationTypes.PATH, {
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    ...mapState(userTypes.PATH, {
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    versionApp() {
      return `Version ${process.env.LATEST_VERSION_APP}`;
    },
  },
  components: {
  },
  async mounted() {
    this.validateLogin();
    this.getUser();
  },
  methods: {
    ...mapActions(notificationTypes.PATH, {
      sendNotification: notificationTypes.actions.SEND_NOTIFICATION,
    }),
    ...mapActions(userTypes.PATH, {
      updatePushToken: userTypes.actions.UPDATE_PUSH_TOKEN,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    validateLogin() {
      if (!localStorage.getItem('tokenMC')) {
        this.$router.push('/');
      } else {
        const roles = localStorage.getItem('rolesArrayMC') ? JSON.parse(localStorage.getItem('rolesArrayMC')) : [];
        if (roles && roles.length > 0) {
          this.$router.push(roles[0].route);
        }
      }
    },
    subscribeToNotifications() {
      console.log('subscribeToNotifications 1');
      const self = this;
      if (window.OneSignal) {
        console.log('subscribeToNotifications 2');
        window.OneSignal.push(() => {
          console.log('subscribeToNotifications 3');
          // window.OneSignal.registerForPushNotifications();
          console.log('subscribeToNotifications 4');
          window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
            console.log('subscribeToNotifications 5', isEnabled);
            if (!isEnabled) {
              console.log('subscribeToNotifications 6');
              window.OneSignal.showNativePrompt();
            } else {
              console.log('Push notifications are already enabled!');
            }
            self.getUser();
          });
        });
      }
    },
    unsubscribeFromNotifications() {
      const self = this;
      console.log('unsubscribeFromNotifications 1');
      if (window.OneSignal) {
        console.log('unsubscribeFromNotifications 2');
        window.OneSignal.push(() => {
          console.log('unsubscribeFromNotifications 3');
          window.OneSignal.setSubscription(false);
          self.getUser();
        });
      }
    },
    async sendNotificationPush() {
      const data = {
        app_id: `${process.env.APP_ID_ONE_SIGNAL}`,
        headings: { en: this.title },
        contents: { en: this.content },
        include_player_ids: [this.userId],
        url: this.url,
      };
      await this.sendNotification(data);
    },
    getUser() {
      const self = this;
      console.log('getUser 1');
      window.OneSignal.push(() => {
        console.log('getUser 2');
        window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
          console.log('getUser 3');
          if (isEnabled) {
            console.log('getUser 4');
            console.log('Push notifications are enabled!');
            window.OneSignal.getUserId((userId) => {
              console.log('OneSignal Home User ID:', userId);
              window.OneSignal.setExternalUserId(localStorage.getItem('userMC'));
              self.myTokenPush = userId;
              localStorage.setItem('tokenPush', userId);
              self.userId = userId;
              self.updatePushToken({ pushToken: userId });
              self.showNotification(self.userResponseMessages, self.userStatus, 'top-right', 5000);
              // Asegúrate de guardar este userId en tu base de datos para usarlo más tarde
            });
            self.subscribed = true;
          } else {
            console.log('getUser 5');
            console.log('Push notifications are not enabled.');
            self.subscribed = false;
          }
        });
      });
    },
  },
};
</script>
