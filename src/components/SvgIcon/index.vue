<template>
  <div>
    <svg :style="{ width, height }">
      <use :xlink:href="symbolId" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  prefix: {
    type: String,
    default: "icon",
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#333",
  },
  width: {
    type: String,
    default: "16px",
  },
  height: {
    type: String,
    default: "16px",
  },
});

// 计算属性 symbolId -->xlink:href属性值
const symbolId = computed(() => {
  return `#${props.prefix}-${props.name}`;
});
</script>

<style scoped></style>
