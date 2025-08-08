<template>
  <div class="repeat-main">
    <div class="repeat-select">
      <el-select v-model="repeat_period" @change="periodChange">
        <el-option :label="$t('repeat.repeat_period_option.0')" value="0" />
        <el-option :label="$t('repeat.repeat_period_option.1')" value="1" />
        <el-option :label="$t('repeat.repeat_period_option.2')" value="2" />
      </el-select>
    </div>

    <div v-if="repeat_period!=0" class="repeat-select">      
      <el-select v-model="repeat_day" multiple @change="change">
        <el-option v-for="item in repeatDayOption" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div class="repeat-select">
      <el-time-picker
        v-model="repeat_second"
        @change="change"
      />
    </div> 
  </div>
</template>

<script>
var moment = require('moment')

export default {
  props: {
    repeatPeriod: {
      type: String,
      required: true
    },
    repeatDay: {
      type: Array,
      required: true
    },
    repeatSecond: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      repeat_period: this.repeatPeriod,
      repeat_day: this.repeatDay,
      repeat_second: moment().startOf('day') + this.repeatSecond * 1000,
    }
  },
  computed: {
    repeatDayOption() {
      if (this.repeat_period === '1') {
        return [
          { label: this.$t('repeat.repeat_day_option.1'), value: '1' },
          { label: this.$t('repeat.repeat_day_option.2'), value: '2' },
          { label: this.$t('repeat.repeat_day_option.3'), value: '3' },
          { label: this.$t('repeat.repeat_day_option.4'), value: '4' },
          { label: this.$t('repeat.repeat_day_option.5'), value: '5' },
          { label: this.$t('repeat.repeat_day_option.6'), value: '6' },
          { label: this.$t('repeat.repeat_day_option.7'), value: '7' },
        ]
      } else if (this.repeat_period === '2') {
        var tmp = []
        for (var i = 1; i <= 28; i++) {
          tmp.push({ label: String(i), value: String(i) })
        }
        return tmp
      } else {
        return []
      }
    },
  },
  watch: {
    repeatPeriod() {
      this.repeat_period = this.repeatPeriod
    },
    repeatDay() {
      this.repeat_day = this.repeatDay
    },
    repeatSecond() {
      this.repeat_second = moment().startOf('day') + this.repeatSecond * 1000
    },
  },
  methods: {
    change() {
      var b = moment(this.repeat_second)
      var c = moment().startOf('day')
      this.$emit('repeat_change', this.repeat_period, this.repeat_day, ((b - c) / 1000))
    },
    periodChange() {
      this.repeat_day = []
      var b = moment(this.repeat_second)
      var c = moment().startOf('day')
      this.$emit('repeat_change', this.repeat_period, this.repeat_day, ((b - c) / 1000))
    },
  }
}
</script>

<style lang="scss" scoped>
.repeat-select{
  padding-bottom: 10px;
}
</style>

<style lang="scss">
.repeat-main{
  .el-input{
    width: 300px;
  }
}
</style>
