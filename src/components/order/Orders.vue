

<template>
  <section>
    <div id="printTest">
      <p>锄禾日当午</p>
      <p>汗滴禾下土</p>
      <p>谁知盘中餐</p>
      <p>粒粒皆辛苦</p>
    </div>
    <button v-print="'#printTest'">打印</button>
  </section>
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>
<style lang="less">
</style>