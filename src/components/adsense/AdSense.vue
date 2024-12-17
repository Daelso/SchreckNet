<template>
  <div>
    <ins
      class="adsbygoogle"
      :style="style"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
    ></ins>
  </div>
</template>

<script>
export default {
  name: "AdSense",
  props: {
    adClient: {
      type: String,
      required: true,
    },
    adSlot: {
      type: String,
      required: true,
    },
    adFormat: {
      type: String,
      default: "auto",
    },
    style: {
      type: Object,
      default: () => ({
        display: "block",
      }),
    },
  },
  mounted() {
    console.log(window);
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    } else {
      console.warn("Google AdSense script is not loaded.");
    }
  },
};
</script>
