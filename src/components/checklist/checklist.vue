<template>
  <div @change="$emit('change', currentValue)" class="mint-checklist">
<!--       :class="{ 'is-limit': max <= currentValue.length }">-->
    <label class="mint-checklist-title" v-text="title"></label>
    <mt-cell v-for="(option,index) in options" :key="index">
      <label class="mint-checklist-label my-checkbox-label" slot="title">
        <span
          :class="{'is-right': align === 'right'}"
          class="mint-checkbox">
          <input
            class="mint-checkbox-input"
            type="checkbox"
            v-model="currentValue"
            :disabled="option.disabled"
            :value="option.value || option">
          <span class="mint-checkbox-core"></span>
        </span>
        <div v-if="option.tKind == 'U' || !option.tKind">
          <img src="../../assets/main/personal_checked@1x.png" width="24" height="24">
          <span class="mint-checkbox-label"
                v-text="(option.userId + ' - ' + option.userName + ' - ' + option.deptTitle ) || option"></span>
          <span class="mint-cell-label" v-text="(option.deptCode + ' - ' + option.deptName) || option"></span>
        </div>
        <div v-if="option.tKind == 'O'">
          <span class="mint-checkbox-label"
                v-text="option.label || option"></span>
        </div>
      </label>
    </mt-cell>
  </div>
</template>

<script>

  /**
   * mt-checklist
   * @module components/checklist
   * @desc 复选框列表，依赖 cell 组件
   *
   * @param {(string[]|object[])} options - 选项数组，可以传入 [{label: 'label', value: 'value', disabled: true}] 或者 ['ab', 'cd', 'ef']
   * @param {string[]} value - 选中值的数组
   * @param {string} title - 标题
   * @param {number} [max] - 最多可选的个数
   * @param {string} [align=left] - checkbox 对齐位置，`left`, `right`
   *
   *
   * @example
   * <mt-checklist :v-model="value" :options="['a', 'b', 'c']"></mt-checklist>
   */
  export default {
    name: 'mt-checklist',

    props: {
      max: Number,
      title: String,
      align: String,
      options: {
        type: Array,
        required: true
      },
      value: Array
    },

    components: {},

    data() {
      return {
        currentValue: this.value
      };
    },

    computed: {
      limit() {
        return this.max < this.currentValue.length;
        // return this.currentValue.length < this.max;
      }
    },

    watch: {
      value(val) {
        this.currentValue = val;
      },

      currentValue(val) {
        if (this.limit) val.pop();
        this.$emit('input', val);
      }
    }

  };
</script>

<style lang="scss" scoped>
  .mint-checkbox-label {
    margin-left: 0 !important;
  }

  .my-checkbox-label {
    padding: 5px 0 0 0 !important;
  }

  .mint-checkbox.is-right {
    line-height: 50px;
  }
</style>
