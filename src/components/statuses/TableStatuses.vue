<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-6 text-center">
        <q-input
          debounce="400"
          color="primary"
          v-model="filter"
          class="q-ml-xs"
          placeholder="Buscar"
          clearable
          dense
          outlined
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div
        class="col-2
        text-center"
      >
        <q-btn
          round
          icon="refresh"
          class=""
          color="primary"
          title="Click para refrescar la tabla"
          @click="list">
        </q-btn>
      </div>
    </div>
    <div class="row q-mt-md">
      <div
        class="col-6
        text-center"
      >
        <upload-image
          :config="{
            name: 'FILE_STATUSE',
            storage: 'statuses',
            modelName: 'statuses',
            modelId: Date.now()
          }"
          @savedFile="reload"
        />
      </div>
      <div
        class="col-6
        text-center"
      >
        <upload-video
          :config="{
            name: 'FILE_STATUSE',
            storage: 'statuses',
            modelName: 'statuses',
            modelId: Date.now()
          }"
          @savedFile="reload"
        />
      </div>
    </div>
    <q-table
      v-if="!isLoading"
      :grid="$q.screen.xs"
      :data="dataTable"
      :columns="columns"
      :filter="filter"
      :pagination="pagination"
      separator="cell"
      class="q-mt-md"
      dense
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            size="sm"
            color="red"
            icon="close"
            title="Click para eliminar el estado"
            @click="remove(props.row)">
          </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-file="props">
        <q-td :props="props">
          <img
            v-if="props.row.type === 'image'"
            :src="getFile(props.row)"
            width="250rem" />
            <video
              v-else
              :src="getFile(props.row)"
              width="250rem"
              controls>
            </video>
        </q-td>
      </template>
    </q-table>
  </div>
</template>
<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import UploadImage from 'components/common/UploadImage.vue';
import UploadVideo from 'components/common/UploadVideo.vue';
import fileTypes from '../../store/modules/file/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  components: {
    UploadImage,
    UploadVideo,
  },
  data() {
    return {
      obj: {},
      type: 'C',
      route: '/new',
      columns: [
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          visible: false,
        },
        {
          name: 'file',
          label: 'Archivo',
          align: 'center',
          visible: false,
        },
        {
          name: 'type',
          align: 'left',
          label: 'Tipo',
          field: 'type',
          sortable: true,
          visible: true,
        },
        {
          name: 'date',
          align: 'left',
          label: 'Fecha',
          field: 'date',
          sortable: true,
          visible: true,
        },
      ],
      pagination: {
        rowsPerPage: 0,
        sortBy: 'registered_date',
        descending: true,
      },
      filter: '',
      data: [],
      polling: null,
      isLoading: false,
      newSelected: null,
    };
  },
  async mounted() {
    this.list();
    this.pollData();
  },
  computed: {
    ...mapState(fileTypes.PATH, [
      'responseMessages',
      'status',
      'statuses',
    ]),
    dataTable() {
      const data = this.statuses.map((element) => ({
        ...element,
        date: formatDateWithTime(element.registered_date),
      }));
      return data;
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(fileTypes.PATH, {
      listStatusesToday: fileTypes.actions.LIST_STATUSES_TODAY,
      deleteFile: fileTypes.actions.DELETE_FILE,
    }),
    getFile(row) {
      return `${process.env.URL_FILES}${row.url}`;
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    async pollData() {
      this.polling = setInterval(async () => {
        await this.list();
      }, 60000);
    },
    async list() {
      this.isLoading = true;
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listStatusesToday();
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
      this.$q.loading.hide();
      this.isLoading = false;
    },
    async reload() {
      window.location.reload();
    },
    async remove(obj) {
      this.$q.dialog({
        title: 'Eliminar visita',
        message: 'Está seguro que desea eliminar el estado?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
          text: 'adsa',
        },
        persistent: true,
      }).onOk(async () => {
        this.obj = obj;
        showLoading('Guardando ...', 'Por favor, espere', true);
        await this.deleteFile(obj.id);

        if (this.status === true) {
          await this.list();
        }
        this.$q.loading.hide();
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
<style scoped>
  .q-banner {
    width: 95% !important;
  }
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
</style>
