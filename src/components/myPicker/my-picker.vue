<template>
  <mt-picker class="my-picker" :visibleItemCount='3' :slots="slots" @change="onValuesChange">
  </mt-picker>
</template>
<script>
  export default {
    name: 'myPicker',
    props: {
      selectData: {type: Array}
    },
    data() {
      return {
        slots: [{
          flex: 1,
          values: [],
          value: '',
          className: 'slot1',
          textAlign: 'center'
        }],
        selected: ''
      }
    },
    methods: {
      onValuesChange(picker, values) {
        this.selected = values[0];
      }
    }
  }
</script>
