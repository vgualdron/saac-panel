<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="showDialog"
      persistent
      @hide="hideModal"
    >
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ title }}</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-separator />
        <q-card-section
          style="max-height: 60vh"
          class="scroll"
        >
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <q-input
              outlined
              v-model.trim="user.document_number"
              label="Numero de documento *"
              lazy-rules
              :rules="rules.document_number"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model.trim="user.name"
              label="Nombre *"
              lazy-rules
              :rules="rules.name"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model.trim="user.first_lastname"
              label="Primer apellido *"
              lazy-rules
              :rules="rules.first_lastname"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model.trim="user.second_lastname"
              label="Segundo apellido *"
              lazy-rules
              :rules="rules.second_lastname"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model.trim="user.phone"
              label="Teléfono *"
              lazy-rules
              type="number"
              :rules="rules.phone"
              :disable="disableInputs"
              hide-bottom-space
              autocomplete="off"
            />
            <q-separator />
            <div v-if="type !== 'V'" class="row text-center">
              <q-btn label="cancelar"
                type="reset"
                color="primary"
                outline class="col"
                v-close-popup
                @click="showDialog = false"
              />
              <q-btn
                label="Aceptar"
                type="submit"
                color="primary"
                class="col q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import newTypes from '../../store/modules/new/types';
import userTypes from '../../store/modules/user/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { removeAccents } from '../../helpers/removeAccents';

export default {
  data() {
    return {
      title: '',
      isLoading: false,
      optionsUsers: [],
      user: {
        id: null,
        document_number: null,
        name: '',
        first_lastname: '',
        second_lastname: '',
        phone: '',
        status: 'borrador',
      },
      copyUser: {
        id: null,
        document_number: null,
        name: '',
        first_lastname: '',
        second_lastname: '',
        phone: '',
        status: 'borrador',
      },
      rules: {
        document_number: [
          (val) => (!!val) || 'El campo de documento es requerido',
          (val) => (val.length >= 5) || 'El campo debe tener un mínimo de 5 caracteres',
          (val) => (val.length <= 15) || 'El campo debe tener un máximo de 15 caracteres',
        ],
        name: [
          (val) => (!!val) || 'El campo es requerido',
          (val) => (val.length >= 5) || 'El campo debe tener un mínimo de 5 caracteres',
          (val) => (val.length <= 50) || 'El campo debe tener un máximo de 50 caracteres',
        ],
        first_lastname: [
          (val) => (!!val) || 'El campo es requerido',
          (val) => (val.length >= 2) || 'El campo debe tener un mínimo de 2 caracteres',
          (val) => (val.length <= 50) || 'El campo debe tener un máximo de 50 caracteres',
        ],
        second_lastname: [
          (val) => (!!val) || 'El campo es requerido',
          (val) => (val.length >= 2) || 'El campo debe tener un mínimo de 2 caracteres',
          (val) => (val.length <= 50) || 'El campo debe tener un máximo de 50 caracteres',
        ],
        phone: [
          (val) => (!!val) || 'El campo es requerido',
          (val) => (val.length >= 5) || 'El campo debe tener un mínimo de 5 caracteres',
          (val) => (val.length <= 15) || 'El campo debe tener un máximo de 15 caracteres',
        ],
      },
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    obj: {
      type: Object,
    },
    type: {
      type: String,
    },
    userSend: {
      require: false,
    },
    showUserSend: {
      type: Boolean,
      default: true,
      require: false,
    },
  },
  async mounted() {
    await this.initData();
  },
  watch: {
    usersOptions(val) {
      this.optionsUsers = [...val];
    },
  },
  computed: {
    ...mapState(newTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    ...mapState(userTypes.PATH, {
      usersOptions: 'usersOptions',
      userStatus: 'status',
      userResponseMessages: 'responseMessages',
    }),
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    disableInputs() {
      return this.type === 'D' || this.type === 'V';
    },
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      listNews: newTypes.actions.LIST_NEWS,
      saveNew: newTypes.actions.SAVE_NEW,
      updateNew: newTypes.actions.UPDATE_NEW,
      deleteNew: newTypes.actions.DELETE_NEW,
    }),
    ...mapActions(userTypes.PATH, {
      listUsers: userTypes.actions.LIST_USERS_OPTIONS,
    }),
    async initData() {
      await Promise.all([await this.listUsers({ displayAll: 0 })]);
      if (this.userStatus === true) {
        this.title = this.type === 'C' ? 'Agregar' : (this.type === 'E' ? 'Editar' : 'Eliminar');
        this.user = this.type === 'C' ? { ...this.copyUser } : { ...this.obj };
        if (this.type === 'V') {
          this.title = 'Ver estado de aprobación';
        }
        if (this.userSend) {
          this.user.userSend = this.userSend;
          this.user.status = 'borrador';
        }
        this.$q.loading.hide();
      } else {
        this.$q.loading.hide();
        if (this.userStatus === false) {
          this.showNotification(this.usersResponseMessages, this.userStatus, 'top-right', 5000);
        }
      }
    },
    async onSubmit() {
      if (this.type === 'C') {
        showLoading('Guardando ...', 'Por favor, espere', true);
        await this.saveNew(this.user);
      } else if (this.type === 'E') {
        showLoading('Actualizando ...', 'Por favor, espere', true);
        await this.updateNew(this.user);
      } else if (this.type === 'D') {
        showLoading('Eliminando ...', 'Por favor, espere', true);
        await this.deleteNew(this.user.id);
      }
      if (this.status === true) {
        this.user = { ...this.copyUser };
        this.listNews(['borrador', 'creado', 'analizando']);
        this.showDialog = false;
      }

      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      this.$q.loading.hide();
    },
    filterUsers(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionsUsers = this.usersOptions.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
      });
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    hideModal() {
    },
  },
};
</script>
