<template>
    <div class="tab_main_content components-content">
        <el-card class="threshold-card">
            <div slot="header" class="card-header">
                <span>阈值告警配置</span>
            </div>

            <div class="threshold-content">
                <el-form ref="thresholdForm" :model="formData" :rules="rules" label-width="120px"
                    class="threshold-form">
                    <el-form-item label="当前阈值:" prop="systemConfValue">
                        <el-input v-model.number="formData.systemConfValue" :disabled="!hasEditPermission"
                            placeholder="请输入阈值" class="threshold-input" controls-position="right"></el-input>
                        <!-- <el-input-number
              v-model="formData.systemConfValue"
              :min="0"
              :max="999999999"
              :precision="0"
              :disabled="!hasEditPermission"
              placeholder="请输入阈值"
              class="threshold-input"
              controls-position="right"
            ></el-input-number> -->
                        <span class="unit-text">bps</span>
                        <span class="formatted-value" v-if="formData.systemConfValue > 0">
                            ({{ formattedBpsValue }})
                        </span>
                        <div class="help-text">
                            <i class="el-icon-info"></i>
                            当网络流量超过此阈值时将触发告警
                        </div>
                    </el-form-item>

                    <!-- <el-form-item label="阈值描述:">
            <span class="description-text">{{ formData.systemConfDesc }}</span>
          </el-form-item> -->

                    <!-- <el-form-item label="创建时间:" v-if="formData.createTime">
            <span class="time-text">{{ parseTime(formData.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </el-form-item> -->

                    <el-form-item>
                        <el-button v-permission="'6-1-edit'" type="primary" :loading="isLoading"
                            @click="updateThresholdData">
                            保存修改
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import { getThreshold, updateThreshold } from '@/api/system-management/threshold'
import { parseTime } from '@/utils'
import { computed } from 'vue'

export default {
    name: 'AlertThreshold',
    data() {
        return {
            parseTime,
            isLoading: false,
            formData: {
                systemConfId: '',
                systemConfKey: '',
                systemConfValue: 0,
                systemConfDesc: '',
                systemConfState: 1,
                createTime: null
            },
            rules: {
                systemConfValue: [
                    { required: true, message: '请输入阈值', trigger: 'blur' },
                    { type: 'number', min: 0, message: '阈值必须大于等于0', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        // 检查是否有编辑权限
        hasEditPermission() {
            // 这里可以根据实际权限系统进行调整
            return this.$store.getters.permissions ? this.$store.getters.permissions.includes('6-1-edit') : true
        },
        // 格式化的bps值
        formattedBpsValue() {
            const bps = this.formData.systemConfValue
            if (bps >= 1000000000) {
                return (bps / 1000000000).toFixed(2) + ' Gbps'
            } else if (bps >= 1000000) {
                return (bps / 1000000).toFixed(2) + ' Mbps'
            } else if (bps >= 1000) {
                return (bps / 1000).toFixed(2) + ' Kbps'
            }
            return bps + ' bps'
        }
    },
    mounted() {
        this.getThresholdData()
    },
    methods: {
        // 获取阈值数据
        async getThresholdData() {
            try {
                this.isLoading = true
                const response = await getThreshold()
                if (response.code === '000000') {
                    this.formData = {
                        systemConfId: response.body.systemConfId,
                        systemConfKey: response.body.systemConfKey,
                        systemConfValue: parseInt(response.body.systemConfValue),
                        systemConfDesc: response.body.systemConfDesc,
                        systemConfState: response.body.systemConfState,
                        createTime: response.body.createTime
                    }
                } else {
                    this.$message.error('获取阈值数据失败：' + response.message)
                }
            } catch (error) {
                console.error('获取阈值数据失败:', error)
                this.$message.error('获取阈值数据失败')
            } finally {
                this.isLoading = false
            }
        },


        // 更新阈值
        updateThresholdData() {
            this.$refs.thresholdForm.validate(async (valid) => {
                if (valid) {
                    try {
                        this.isLoading = true
                        const response = await updateThreshold({
                            systemConfValue: this.formData.systemConfValue.toString()
                        })

                        if (response.code === '000000') {
                            this.$message.success('阈值修改成功')
                            // 重新获取数据以更新显示
                            this.getThresholdData()
                        } else {
                            this.$message.error('阈值修改失败：' + response.message)
                        }
                    } catch (error) {
                        console.error('阈值修改失败:', error)
                        this.$message.error('阈值修改失败')
                    } finally {
                        this.isLoading = false
                    }
                } else {
                    this.$message.error('请检查输入的阈值是否正确')
                    return false
                }
            })
        },


    }
}
</script>

<style lang="scss" scoped>
.tab_main_content {
    padding: 25px;
}

.card-header {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
}

.threshold-content {
    padding: 20px 0;
}

.threshold-form {
    .threshold-input {
        width: 200px;
        margin-right: 10px;
    }

    .unit-text {
        color: #606266;
        font-size: 14px;
        margin-right: 10px;
    }

    .formatted-value {
        color: #67C23A;
        font-size: 14px;
        font-weight: 500;
    }

    .help-text {
        margin-top: 5px;
        color: #909399;
        font-size: 12px;

        i {
            margin-right: 4px;
        }
    }

    .description-text {
        color: #606266;
        font-size: 14px;
    }

    .time-text {
        color: #909399;
        font-size: 14px;
    }
}

.el-form-item {
    margin-bottom: 22px;
}
</style>
