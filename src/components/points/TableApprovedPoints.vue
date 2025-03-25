<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-9 text-center">
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
    </div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :selected.sync="selected"
      :loading="isLoadingTable"
      :filter="filter"
      :pagination.sync="pagination"
      separator="cell"
      class="q-mt-md"
      dense>
      <template v-slot:body="props">
        <q-tr :props="props" @click="clickRow(props.row)">
          <q-td key="actions" :props="props">
            <q-btn
              class=""
              color="green"
              icon="check"
              size="sm"
              title="Click para aprobar"
              :disable="props.row.amount <= 0"
              @click="changeStatus(props.row, 'aprobado')">
            </q-btn>
            <q-btn
              color="red"
              icon="close"
              class="q-ml-sm"
              size="sm"
              title="Click para rechazar"
              @click="changeStatus(props.row, 'rechazado')">
            </q-btn>
          </q-td>
          <q-td key="file_url" :props="props">
            <a :href="getLink(props.row)" target="_blank" >Abrir</a>
          </q-td>
          <q-td key="created_at" :props="props">
            {{ formatDate(props.row.created_at) }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="shop_name" :props="props">
            {{ props.row.shop_name }}
          </q-td>
          <q-td key="observation" :props="props">
            <q-icon size="xs" name="edit" />
            {{ (props.row.observation) }}
            <q-popup-edit :value="props.row.observation" v-slot="scope" buttons
              @input="val => save('observation', val)">
              <q-input v-model="scope.value" type="text" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="amount" :props="props">
            <q-icon size="xs" name="edit" />
            {{ (props.row.amount) }}
            <q-popup-edit :value="props.row.amount" v-slot="scope" buttons
              @input="val => save('amount', val)">
              <q-input v-model="scope.value" type="number" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="price" :props="props">
            <q-icon size="xs" name="edit" />
            {{ formatPrice(props.row.price) }}
            <q-popup-edit :value="props.row.price" v-slot="scope" buttons
              @input="val => save('price', val)">
              <q-input v-model="scope.value" type="number" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="invoice_number" :props="props">
            {{ props.row.invoice_number }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { showNotifications } from '../../helpers/showNotifications';
import pointTypes from '../../store/modules/point/types';
import { showLoading } from '../../helpers/showLoading';
import { formatDateWithTime } from '../../helpers/formatDate';

export default {
  data() {
    return {
      isLoadingTable: false,
      selected: [],
      itemSelected: {},
      columns: [
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'left',
          style: 'width: 100px',
          headerStyle: 'height: 50px',
        },
        {
          name: 'file_url',
          required: true,
          label: 'Foto factura',
          align: 'center',
          sortable: true,
        },
        {
          name: 'created_at',
          required: true,
          label: 'Fecha',
          align: 'left',
          field: (row) => row.created_at,
          sortable: true,
        },
        {
          name: 'name',
          required: true,
          label: 'Nombre asociado',
          align: 'left',
          field: (row) => row.name,
          sortable: true,
        },
        {
          name: 'shop_name',
          required: true,
          label: 'Comercio',
          align: 'left',
          field: (row) => row.shop_name,
          sortable: true,
        },
        {
          name: 'observation',
          required: true,
          label: 'Observación',
          align: 'left',
          field: 'observation',
          sortable: true,
        },
        {
          name: 'amount',
          required: true,
          label: 'Puntos',
          align: 'left',
          field: 'amount',
          sortable: true,
        },
        {
          name: 'price',
          required: true,
          label: 'Precio',
          align: 'left',
          field: 'price',
          sortable: true,
        },
        {
          name: 'invoice_number',
          required: true,
          label: '# factura',
          align: 'left',
          field: 'invoice_number',
          sortable: true,
        },
      ],
      pagination: {
        rowsPerPage: 30,
      },
      filter: '',
      isDiabledAdd: false,
      showModal: false,
    };
  },
  async mounted() {
    this.isLoadingTable = true;
    showLoading('Cargando ...', 'Por favor, espere', true);
    await this.getPoints();
    this.isLoadingTable = false;
    this.$q.loading.hide();
  },
  computed: {
    ...mapState(pointTypes.PATH, [
      'points',
    ]),
    data() {
      return [...this.points];
    },
  },
  methods: {
    ...mapActions(pointTypes.PATH, {
      fetchPoints: pointTypes.actions.FETCH_POINTS,
      updatePoint: pointTypes.actions.UPDATE_POINT,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    formatDate(date) {
      return formatDateWithTime(date);
    },
    async getPoints() {
      await this.fetchPoints('pendiente');
    },
    async save(field, value) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      this.isLoadingTable = true;
      const data = {
        id: this.itemSelected.id,
      };
      data[field] = value;
      await this.updatePoint(data);
      await this.getPoints();
      this.isLoadingTable = false;
      this.$q.loading.hide();
    },
    async changeStatus(obj, status) {
      this.$q.dialog({
        title: 'Cambiar de estado',
        message: 'Está seguro que desea cambiar de estado?',
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
        await this.save('status', status);

        if (this.status === true) {
          await this.getPoints();
        }
        this.$q.loading.hide();
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
    formatPrice(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    },
    getLink(row) {
      return `${process.env.URL_FILES}${row.file_url}`;
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    addRow() {
      this.showModal = true;
    },
  },
  components: {
    // UploadImage,
  },
};
</script>
