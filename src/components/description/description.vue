<template>
  <div id="description">
<div  class="description">
  <span><label >业务说明区</label></span>
</div>
    <p>1.本流程审批需业经总经理</p>
    <p>2.依据公司制度</p>
    <mt-cell title="标题" label="描述信息" is-link></mt-cell>
  </div>
</template>

<script>
    import MtChecklist from "../checklist/checklist";

    export default {
      components: {MtChecklist},
      name: "description"
    }
</script>

<style lang="scss" scoped>



</style>
