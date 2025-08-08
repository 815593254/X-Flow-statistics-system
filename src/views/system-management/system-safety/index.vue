<template>
  <div class="main-background">
    <TabSelect :tab-map="tabMap" :route-name="routeName">
      <template v-slot:main>
        <div class="main-content">
          <router-view />
        </div>
      </template>
    </TabSelect>
  </div>

</template>

<script>
import TabSelect from '@/components/TabSelect'

export default {
  components: {
    TabSelect
  },

  data() {
    return {
      tabMap: [
        { label: this.$t('route.policyUpdate'), value: 'PolicyUpdate', disabled: false },
        { label: this.$t('route.emailAlert'), value: 'EmailAlert', disabled: true },
        { label: this.$t('route.backupRestore'), value: 'BackupRestore', disabled: true },
        { label: this.$t('route.loginSafety'), value: 'LoginSafety', disabled: false },
      ]
    }
  },

  computed: {
    routeName() {
      return this.$route.name
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
