<template>
  <div class="q-pa-xs">
    <div class="row q-ma-xs">
      <div class="col-12 text-center">
        <q-btn
          v-if="urlFile && type === 'read'"
          round
          icon="location_on"
          class="q-mb-xs"
          color="primary"
          @click="openInGoogleMaps">
        </q-btn>
        <img
          v-if="urlFile"
          :src="urlFile"
          width="250rem" />
        <p v-else class="text-subtitle1 text-center">No se ha cargado archivo</p>
        <q-banner
          v-if="item && item.status == 'rechazado' && item.observation"
          class="bg-red text-white q-ma-md wrap-text">
          {{ item.status }}: {{ item.observation }}
        </q-banner>
        <q-banner
          v-else-if="item && item.status == 'aprobado'"
          class="bg-green text-white q-ma-md">
          {{ item.status }}
        </q-banner>
        <q-btn
          v-if="(!item && type !== 'read') || (item && item.status !== 'aprobado' && type !== 'read')"
          label="Agregar foto"
          color="primary"
          icon="add_a_photo"
          ref="camera"
          class="q-mt-sm"
          @click="initCamera" />
        <template v-else-if="item && item.status === 'creado'">
          <div class="q-mt-md">
            <q-icon size="xs" name="edit" />
            {{ item.observation ? item.observation : 'Haz click para agregar una observación' }} <br>
            <q-popup-edit :value="item.observation" v-slot="scope" buttons
              @input="val => save('observation', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </div>
          <q-btn
            label="Aprobar"
            color="primary"
            ref="camera"
            class="q-mt-sm"
            @click="save('status', 'aprobado')"
          />
          <q-btn
            label="Rechazar"
            color="primary"
            ref="camera"
            class="q-mt-sm q-ml-sm"
            :disabled="!item.observation"
            outline
            @click="save('status', 'rechazado')"
          />
        </template>
      </div>
    </div>
    <q-dialog
      v-if="showModal"
      v-model="showModal"
      persistent>
      <q-card style="max-width: 95vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Subir foto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 60vh" class="scroll">
          <div class="row">
            <q-uploader
              accept="image/*"
              ref="uploader"
              color="primary"
              text-color="white"
              :no-thumbnails="false"
              label="Haz clic en el [+] para seleccionar"
              :multiple="false"
              :url="uploadUrl"
              field-name="file"
              @added="handleAdded"
              @uploaded="handleUploaded"
              @failed="handleFailed"
              :factory="fileFactory"
              :hide-upload-btn="true"
              :auto-upload="false"
            />
          </div>
        </q-card-section>
        <q-separator />
        <div class="row text-center q-pa-md">
          <q-btn
            label="Guardar"
            color="primary"
            class="col q-ml-sm"
            :disabled="!image"
            @click="sendImage"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import fileTypes from '../../store/modules/file/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  name: 'UploadImage',
  data() {
    return {
      item: null,
      urlFile: null,
      track: null,
      image: null,
      blob: null,
      showModal: false,
      uploadUrl: 'https://example.com/upload',
      location: null, // Para almacenar la ubicación actual
      googleMapUrl: '', // La URL para el iframe de Google Maps
      error: null,
    };
  },
  props: {
    config: {},
    type: {
      type: String,
      default: '',
    },
  },
  async mounted() {
    await this.fetchFile();
  },
  computed: {
    ...mapState(fileTypes.PATH, [
      'responseMessages',
      'status',
    ]),
    file() {
      const { file } = this.image;
      return file;
    },
    extension() {
      const { type } = this.image;
      const ext = type.split('/');
      return ext.length > 1 ? ext[1] : ext[0];
    },
    link() {
      if (this.responseMessages && this.responseMessages.length > 0) {
        return `${process.env.URL_FILES}${this.responseMessages[0].text}`;
      }
      return '';
    },
  },
  methods: {
    ...mapActions(fileTypes.PATH, {
      saveFile: fileTypes.actions.SAVE_FILE,
      updateFile: fileTypes.actions.UPDATE_FILE,
      getFile: fileTypes.actions.GET_FILE,
    }),
    openInGoogleMaps() {
      if (this.item) {
        const { latitude, longitude } = this.item;
        // Crear la URL para abrir en Google Maps
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        console.log(googleMapsUrl);
        // Abrir la URL en una nueva pestaña o ventana del navegador
        window.open(googleMapsUrl, '_blank');
      } else {
        this.error = 'Location not available. Please allow location access.';
      }
    },
    async getLocation() {
      try {
        if (navigator.geolocation) {
          // Usamos una promesa para envolver el método getCurrentPosition
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          // Almacenamos la latitud y longitud
          this.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } else {
          this.error = 'Unable to retrieve location. Please allow access.';
        }
      } catch (err) {
        this.error = 'Geolocation is not supported by this browser.';
      }
    },
    async initCamera() {
      this.showModal = true;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    handleAdded(files) {
      if (files.length > 0) {
        const file = files[0];
        if (file instanceof File) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target.result.split(',')[1];
            this.image = {
              name: file.name,
              type: file.type,
              file: base64,
            };
          };
          reader.readAsDataURL(file);
        } else {
          console.error('El archivo no es una instancia de File:', file);
        }
      }
    },
    handleUploaded(file) {
      console.log('Archivo subido con éxito:', file);
    },
    handleFailed(file) {
      console.log('Error al subir el archivo:', file);
    },
    fileFactory(file) {
      // Puedes modificar el archivo aquí si es necesario
      return file;
    },
    async sendImage() {
      showLoading('Guardando ...', 'Por favor, espere', true);
      await this.getLocation();
      const {
        name,
        storage,
        modelId,
        modelName,
      } = this.config;

      const {
        latitude,
        longitude,
      } = this.location;

      await this.saveFile({
        name,
        storage,
        modelName,
        modelId,
        type: 'image',
        file: this.file,
        extension: this.extension,
        status: name === 'FOTO_VOUCHER' ? 'creado' : 'creado',
        latitude,
        longitude,
      });
      this.$q.loading.hide();
      if (this.responseMessages && this.status) {
        this.showModal = false;
        await this.fetchFile();
        const { id } = this.item;
        this.$emit('savedFile', { id, name, modelId });
      }
      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
    },
    async fetchFile() {
      showLoading('consultando archivo ...', 'Por favor, espere', true);
      const {
        name,
        modelId,
        modelName,
      } = this.config;

      const response = await this.getFile({
        name,
        modelName,
        modelId,
      });

      this.$q.loading.hide();

      if (response.data) {
        this.item = response.data;
        this.urlFile = `${process.env.URL_FILES}${this.item.url}`;
      }
    },
    async save(field, value) {
      const {
        name,
      } = this.config;

      this.item[field] = value.value ? value.value : value;
      await this.updateFile(this.item);
      if (this.responseMessages && this.status) {
        this.$emit('updateStatus', { name, field, value });
        await this.fetchFile();
      }
    },
  },
};
</script>
<style scoped>
  .video-container {
    position: relative;
    display: inline-block;
  }
  img {
    display: block;
    max-width: 640px;
    margin: auto;
  }
  video {
    display: block;
    max-width: 640px;
    margin: auto;
  }
  .overlay-square {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    border: 2px solid red;
    transform: translate(-50%, -50%);
    pointer-events: none; /* Make sure the square doesn't block interactions with the video */
  }
  .q-banner {
    width: 210px;
  }
  .wrap-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
</style>
