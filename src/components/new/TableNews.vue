<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-10 text-center">
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
          class="q-mr-md"
          color="primary"
          title="Click para refrescar la tabla"
          @click="listNewsMounted">
        </q-btn>
        <q-btn
          color="primary"
          label="Agregar"
          @click="showForm(null, 'C')"
          :disabled="!validatedPermissions.create.status"
          :title="validatedPermissions.create.title"
        />
      </div>
    </div>
    <q-table
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
          <div>
            <q-btn
              v-if="props.row.showEdit"
              color="primary"
              field="edit"
              icon="edit"
              size="xs"
              :disabled="!validatedPermissions.edit.status"
              :title="validatedPermissions.edit.title"
              @click="showForm(props.row, 'E')"
              round
            />
            <q-btn
              v-if="props.row.showDelete"
              class="q-ml-xs"
              color="red"
              field="delete"
              icon="delete"
              size="xs"
              :disabled="!validatedPermissions.delete.status"
              :title="validatedPermissions.delete.title"
              @click="showForm(props.row, 'D')"
              round
            />
            <q-btn
              v-if="props.row.showChangeStatus"
              class="q-ml-xs"
              color="green"
              field="changeStatus"
              icon="save"
              size="xs"
              :disabled="!validatedPermissions.changeStatus.status"
              :title="validatedPermissions.changeStatus.title"
              @click="changeStatus(props.row, 'CS')"
              round
            />
            <q-btn
              v-if="props.row.status === 'analizando'"
              class="q-ml-xs"
              color="primary"
              field="changeStatus"
              icon="search"
              size="xs"
              @click="showForm(props.row, 'V')"
              round
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="props.row.status === 'analizando' ? 'orange' : 'blue'">
            {{  props.row.status }}
          </q-badge>
        </q-td>
      </template>
    </q-table>
    <form-news
      v-if="showModal"
      v-model="showModal"
      :type="type"
      :obj="obj"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import FormNews from 'components/new/FormNews.vue';
import newTypes from '../../store/modules/new/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';
import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  components: {
    FormNews,
  },
  data() {
    return {
      showModal: false,
      obj: {},
      type: 'C',
      route: '/new',
      name: 'Información de nuevos',
      columns: [
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          visible: false,
        },
        {
          name: 'type_document',
          label: 'Tipo Doc',
          align: 'left',
          field: 'type_document',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'document_number',
          label: 'Documento',
          align: 'left',
          field: 'document_number',
          sortable: true,
          visible: true,
          headerStyle: 'height: 50px',
        },
        {
          name: 'name',
          align: 'left',
          label: 'Nombre',
          field: 'name',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'first_lastname',
          align: 'left',
          label: 'Primer apellido',
          field: 'first_lastname',
          style: 'max-width: 300px',
          classes: 'ellipsis',
          sortable: true,
          visible: true,
        },
        {
          name: 'second_lastname',
          align: 'left',
          label: 'Segundo apellido',
          field: 'second_lastname',
          sortable: true,
          visible: true,
        },
        {
          name: 'address',
          align: 'left',
          label: 'Dirección',
          field: 'address',
          sortable: true,
          visible: true,
        },
        {
          name: 'company_id',
          align: 'left',
          label: 'Empresa',
          field: 'company_id',
          sortable: true,
          visible: true,
        },
        {
          name: 'city_id',
          align: 'left',
          label: 'Cuidad',
          field: 'city_id',
          sortable: true,
          visible: true,
        },
        {
          name: 'status',
          align: 'left',
          label: 'Estado',
          field: 'status',
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
      },
      filter: '',
      data: [],
      polling: null,
    };
  },
  async mounted() {
    this.listNewsMounted();
    this.pollData();
  },
  computed: {
    ...mapState(newTypes.PATH, [
      'news',
      'responseMessages',
      'status',
      'new',
    ]),
    dataTable() {
      const data = this.news.map((element) => ({
        ...element,
        date: formatDateWithTime(element.date),
        showEdit: element.status === 'borrador',
        showDelete: element.status === 'borrador',
        showChangeStatus: element.status === 'borrador',
      }));
      return data;
    },
    validatedPermissions() {
      const statusCreate = havePermission('new.create');
      const statusEdit = havePermission('new.update');
      const statusDelete = havePermission('new.delete');
      const statuschangeStatus = havePermission('new.changeStatus');
      return {
        create: {
          title: statusCreate ? 'Registrar nuevos' : 'No tiene permisos para registrar nuevos',
          status: statusCreate,
        },
        edit: {
          title: statusEdit ? 'Editar nuevo' : 'No tiene permisos para editar nuevos',
          status: statusEdit,
        },
        delete: {
          title: statusDelete ? 'Eliminar nuevo' : 'No tiene permisos para eliminar nuevos',
          status: statusDelete,
        },
        changeStatus: {
          title: statuschangeStatus ? 'Guardar el registro' : 'No tiene permisos',
          status: statuschangeStatus,
        },
      };
    },
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(newTypes.PATH, {
      listNews: newTypes.actions.LIST_NEWS,
      updateStatusNew: newTypes.actions.UPDATE_STATUS_NEW,
    }),
    async pollData() {
      this.polling = setInterval(async () => {
        await this.listNewsMounted();
      }, 60000);
    },
    async listNewsMounted() {
      showLoading('Cargando ...', 'Por favor, espere', true);
      await this.listNews(['borrador', 'creado', 'analizando']);
      if (this.status === false) {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
      }
      this.$q.loading.hide();
    },
    async showForm(obj, type) {
      this.obj = obj;
      this.type = type;
      showLoading('Preparando formulario ...', 'Por favor, espere', true);
      this.showModal = true;
    },
    async changeStatus(obj, type) {
      this.obj = obj;
      this.type = type;
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.updateStatusNew({
        ...obj,
        status: 'creado',
      });

      if (this.status === true) {
        this.user = { ...this.copyUser };
        await this.listNewsMounted();
      }
      this.$q.loading.hide();
      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
