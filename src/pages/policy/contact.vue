<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          filled
          bg-color="white"
          v-model="email"
          label="Your email *"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 6 && val.length <= 64) ||
              'Please enter a valid email address.',
            (val) =>
              (val &&
                val.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) ||
              'Please enter a valid email address.',
          ]"
        />
        <q-select
          color="teal"
          filled
          bg-color="white"
          v-model="reason"
          :options="options"
          label="Subject"
          style="margin-bottom: 25px"
        >
          <template v-slot:prepend>
            <q-icon name="chat_bubble" />
          </template>
        </q-select>

        <q-input
          v-model="text"
          filled
          type="textarea"
          bg-color="white"
          label="Your text below"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "contact-form",
  setup() {
    const $q = useQuasar();
    const axios = require("axios");
    const email = ref(null);
    const reason = ref(null);
    const text = ref(null);
    const options = ref(["Feedback", "Bug Report", "Advertising", "Legal"]);
    const router = useRouter();

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    return {
      email,
      reason,
      options,
      text,

      onSubmit() {
        let contactInfo = {
          email: email.value,
          reason: reason.value,
          text: text.value,
        };

        axios
          .post(baseUrl + "/user/sendContactEmail", contactInfo, {
            withCredentials: true,
          })
          .then(() => {
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Sent!",
            });
            router.push({ name: "home" });
          })
          .catch(() => {
            $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: `Failed to send, please try again later.`,
            });
          });
      },
    };
  },
});
</script>
