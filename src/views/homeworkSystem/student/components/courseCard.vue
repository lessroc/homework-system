<template>
  <div class="course-card">
    <a-card
      :hoverable="true"
      :body-style="{ padding: '0px' }"
      :style="{ width: '100%' }"
      :cover="cover"
    >
      <a-card-meta
        :title="props.courseDetail.courseName"
        :description="props.courseDetail.courseDescription"
      />
    </a-card>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
