import Vue from 'vue'
import axios from 'axios'
// import VueAxios from 'vue-plugin-axios'
import VueAxios from '@/../../../vue-plugin-axios/src/'
import store from '@/store'
import { vp } from '@/tools/helpers'
import { showServerError } from '@/tools/validator'

const baseApiURL = 'http://localhost:8000/api/'

Vue.use(VueAxios, {
  axios,
  config: {
    baseURL: baseApiURL,
    headers: {
      'X-Requested-With': 'XMLHttpRequest' // so laravel will understand that this is ajax $request->ajax()
    }
  },
  interceptors: {
    beforeRequest (config, axiosInstance) {
      if (config.baseURL === baseApiURL) {
        const token = store.state.auth.token

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }

      return config
    },
    beforeResponseError (error) {
      const { response, message } = error

      if (response) { // backend error
        showServerError(response)
      } else if (message) { // network error
        vp.$notify.error(message)
      }

      // return Promise.reject(error)
    }
  }
})