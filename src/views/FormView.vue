<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { addRecord } from "@/utils/storage.js";

const router = useRouter();

const form = ref({
  package: "10",
  name: "",
  idCard: "",
});

const submitting = ref(false);

const packageOptions = [
  { label: "10套装", value: "10" },
  { label: "5套装", value: "5" },
  { label: "2套装", value: "2" },
];

function validate() {
  if (!form.value.name.trim()) {
    showToast("请输入姓名");
    return false;
  }
  if (!form.value.idCard.trim()) {
    showToast("请输入身份证号");
    return false;
  }
  const idReg =
    /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[\dXx]$/;
  if (!idReg.test(form.value.idCard.trim())) {
    showToast("身份证号格式不正确");
    return false;
  }
  return true;
}

async function onSubmit() {
  if (!validate()) return;
  submitting.value = true;
  try {
    const record = addRecord({
      package: form.value.package,
      name: form.value.name.trim(),
      idCard: form.value.idCard.trim(),
    });
    router.push({ path: "/result", query: { id: record.id } });
  } catch (e) {
    showToast(e.message || "提交失败");
  } finally {
    submitting.value = false;
  }
}

function goHistory() {
  router.push("/history");
}
</script>

<template>
  <div class="form-page">
    <div class="form-header">
      <div class="form-title">预约登记</div>
      <div class="form-subtitle">请填写真实信息，以便后续核验</div>
    </div>

    <div class="form-card">
      <van-cell-group inset>
        <van-cell title="选择套装" class="package-cell">
          <template #value>
            <div class="package-options">
              <div
                v-for="opt in packageOptions"
                :key="opt.value"
                class="package-option"
                :class="{ active: form.package === opt.value }"
                @click="form.package = opt.value"
              >
                {{ opt.label }}
              </div>
            </div>
          </template>
        </van-cell>

        <van-field
          v-model="form.name"
          label="姓名"
          placeholder="请输入真实姓名"
          maxlength="20"
          clearable
          :rules="[{ required: true }]"
        />

        <van-field
          v-model="form.idCard"
          label="身份证号"
          placeholder="请输入18位身份证号"
          maxlength="18"
          clearable
          type="idcard"
        />
      </van-cell-group>
    </div>

    <div class="form-tips">
      <van-icon name="warning-o" class="tip-icon" />
      <span>信息将加密保存，仅用于预约核验</span>
    </div>

    <div class="form-action">
      <van-button
        type="primary"
        round
        block
        size="large"
        :loading="submitting"
        loading-text="提交中..."
        @click="onSubmit"
      >
        确认提交
      </van-button>
    </div>
    <van-button plain round hairline @click="goHistory" class="view-history">
      查看历史
    </van-button>
  </div>
</template>

<style scoped>
.form-page {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 40px;
}

.form-header {
  background: linear-gradient(180deg, #b71c1c 0%, #c62828 100%);
  padding: 40px 20px 60px;
  text-align: center;
  color: #fff;
}

.form-title {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 2px;
}

.form-subtitle {
  font-size: 13px;
  margin-top: 8px;
  opacity: 0.85;
}

.form-card {
  margin: -30px 16px 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.package-cell :deep(.van-cell__value) {
  flex: 1;
  text-align: right;
}

.package-options {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  text-align: center;
}

.package-option {
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid #dcdcdc;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.package-option.active {
  background: #b71c1c;
  color: #fff;
  border-color: #b71c1c;
  font-weight: 500;
}

.form-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  font-size: 12px;
  color: #999;
  gap: 4px;
}

.tip-icon {
  color: #b71c1c;
  font-size: 14px;
}

.form-action {
  margin: 24px 16px 0;
}

.form-action :deep(.van-button--primary) {
  background: linear-gradient(90deg, #b71c1c, #c62828);
  border: none;
  font-size: 16px;
  letter-spacing: 2px;
  height: 46px;
}
.view-history {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
</style>

<style></style>
