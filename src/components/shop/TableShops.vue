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
              v-if="props.row.status === 'activo'"
              class=""
              color="green"
              size="sm"
              label="Desactivar"
              @click="changeStatus(props.row, 'inactivo')">
            </q-btn>
            <q-btn
              v-if="props.row.status === 'inactivo'"
              color="red"
              class="q-ml-sm"
              size="sm"
              label="Activar"
              @click="changeStatus(props.row, 'activo')">
            </q-btn>
          </q-td>
          <q-td key="url_logo" :props="props">
            <upload-image
              :config="{
                name: 'LOGO_SHOP',
                storage: 'shops',
                modelName: 'shops',
                modelId: props.row.id
              }"
              @savedFile="reload"
            />
          </q-td>
          <q-td key="nit" :props="props" class="wrap-text">
            <q-icon size="xs" name="edit" />
            {{ props.row.nit }}
            <q-popup-edit :value="props.row.nit" v-slot="scope" buttons
              @input="val => save('nit', val)">
              <q-input v-model="scope.value" type="text" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="name" :props="props" class="wrap-text">
            <q-icon size="xs" name="edit" />
            {{ props.row.name }}
            <q-popup-edit :value="props.row.name" v-slot="scope" buttons
              @input="val => save('name', val)">
              <q-input v-model="scope.value" type="text" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="category_name" :props="props" class="wrap-text">
            {{ props.row.category_name }}
          </q-td>
          <q-td key="agreement" :props="props" class="wrap-text">
            <q-icon size="xs" name="edit" />
            <div v-html="props.row.agreement"></div>
            <q-popup-edit :value="props.row.agreement" v-slot="scope" buttons
              @input="val => save('agreement', val)">
              <q-input v-model="scope.value" type="textarea" dense autofocus autogrow />
            </q-popup-edit>
          </q-td>
          <q-td key="order" :props="props">
            <q-icon size="xs" name="edit" />
            {{ (props.row.order) }}
            <q-popup-edit :value="props.row.order" v-slot="scope" buttons
              @input="val => save('order', val)">
              <q-input v-model="scope.value" type="number" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="address" :props="props" class="wrap-text">
            <q-icon size="xs" name="edit" />
            {{ props.row.address }}
            <q-popup-edit :value="props.row.address" v-slot="scope" buttons
              @input="val => save('address', val)">
              <q-input v-model="scope.value" type="text" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="phone" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.phone }}
            <q-popup-edit :value="props.row.phone" v-slot="scope" buttons
              @input="val => save('phone', val)">
              <q-input v-model="scope.value" type="text" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="email" :props="props" class="wrap-text">
            <q-icon size="xs" name="edit" />
            {{ props.row.email }}
            <q-popup-edit :value="props.row.email" v-slot="scope" buttons
              @input="val => save('email', val)">
              <q-input v-model="scope.value" type="text" dense autofocus />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import UploadImage from 'components/common/UploadImage.vue';
import { showNotifications } from '../../helpers/showNotifications';
import shopTypes from '../../store/modules/shop/types';
import { showLoading } from '../../helpers/showLoading';

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
          name: 'url_logo',
          required: true,
          label: 'Logo',
          align: 'center',
          sortable: true,
        },
        {
          name: 'nit',
          required: true,
          label: 'Nit',
          align: 'left',
          style: 'max-width: 150px',
          classes: 'wrap-text',
          sortable: true,
        },
        {
          name: 'name',
          required: true,
          label: 'Nombre',
          align: 'left',
          style: 'max-width: 150px',
          classes: 'wrap-text',
          sortable: true,
        },
        {
          name: 'category_name',
          required: true,
          label: 'Categoria',
          align: 'left',
          sortable: true,
        },
        {
          name: 'agreement',
          required: true,
          label: 'Descripción',
          align: 'left',
          style: 'max-width: 300px',
          classes: 'wrap-text',
          sortable: true,
        },
        {
          name: 'order',
          required: true,
          label: 'Orden',
          align: 'left',
          field: 'order',
          sortable: true,
        },
        {
          name: 'address',
          required: true,
          label: 'Dirección',
          align: 'left',
          field: 'address',
          style: 'max-width: 300px',
          sortable: true,
        },
        {
          name: 'phone',
          required: true,
          label: 'Telefono',
          align: 'left',
          field: 'phone',
          sortable: true,
        },
        {
          name: 'email',
          required: true,
          label: 'Correo',
          align: 'left',
          field: 'email',
          style: 'max-width: 200px',
          sortable: true,
        },
      ],
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      isDiabledAdd: false,
      showModal: false,
    };
  },
  components: {
    UploadImage,
  },
  async mounted() {
    this.isLoadingTable = true;
    showLoading('Cargando ...', 'Por favor, espere', true);
    await this.getShops();
    this.isLoadingTable = false;
    this.$q.loading.hide();
  },
  computed: {
    ...mapState(shopTypes.PATH, [
      'shops',
    ]),
    data() {
      return [...this.shops];
    },
  },
  methods: {
    ...mapActions(shopTypes.PATH, {
      fetchShops: shopTypes.actions.LIST_SHOPS,
      updateShop: shopTypes.actions.UPDATE_SHOP,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async getShops() {
      await this.fetchShops(['activo', 'inactivo']);
    },
    async save(field, value) {
      showLoading('Guardando ...', 'Por favor, espere', true);
      this.isLoadingTable = true;
      const data = {
        id: this.itemSelected.id,
      };
      data[field] = value;
      await this.updateShop(data);
      await this.getShops();
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
          await this.getShops();
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
      return `${process.env.URL_FILES}${row.url_logo}`;
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    addRow() {
      this.showModal = true;
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
