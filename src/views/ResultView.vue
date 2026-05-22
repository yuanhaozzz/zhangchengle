<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getRecords } from "@/utils/storage.js";

const route = useRoute();
const router = useRouter();

const record = ref(null);
const countdown = ref("03:00:00");
let timer = null;

const steps = [
  { label: "预约提交成功", active: true },
  { label: "预约审核成功", active: true },
  { label: "预约结果验证", active: true },
];

const maskedIdCard = computed(() => {
  if (!record.value?.idCard) return "";
  const id = record.value.idCard;
  if (id.length <= 4) return id;
  return "*".repeat(id.length - 4) + id.slice(-4);
});

function startCountdown() {
  // 3小时 = 10800秒
  let total = 3 * 60 * 60;
  timer = setInterval(() => {
    if (total <= 0) {
      clearInterval(timer);
      countdown.value = "00:00:00";
      return;
    }
    total--;
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    countdown.value = `${h}:${m}:${s}`;
  }, 1000);
}

function goHistory() {
  router.push("/history");
}

function goHome() {
  router.push("/");
}

onMounted(() => {
  const id = Number(route.query.id);
  const list = getRecords();
  record.value = list.find((r) => r.id === id) || list[0] || null;
  startCountdown();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="result-page">
    <div class="result-header">
      <div class="result-title">预约结果</div>
    </div>

    <div class="result-body">
      <!-- 进度条 -->
      <div class="step-bar">
        <div class="step-line">
          <div v-for="(step, idx) in steps" :key="idx" class="step-dot-wrapper">
            <div class="step-dot" :class="{ active: step.active }"></div>
            <div class="step-label" :class="{ active: step.active }">
              {{ step.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- 成功标识 -->
      <div class="success-section">
        <div class="success-icon">
          <van-icon name="success" />
        </div>
        <div class="success-title">预约成功！</div>
        <div class="success-desc">
          预约已通过审核，请在
          <span class="highlight">{{ countdown }}</span>
          内完成支付，超时视为自动放弃。
        </div>
      </div>

      <!-- 信息卡片 -->
      <div class="info-card" v-if="record">
        <div class="info-card-title">
          <van-icon name="user-o" />
          基础信息
        </div>
        <div class="info-row">
          <span class="info-label">套装</span>
          <span class="info-value">{{ record.package }}套装</span>
        </div>
        <div class="info-row">
          <span class="info-label">姓名</span>
          <span class="info-value">{{ record.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">身份证号</span>
          <span class="info-value id-card">{{ maskedIdCard }}</span>
        </div>
      </div>

      <!-- 库存提示 -->
      <div class="stock-card">
        <div class="stock-left">
          <van-icon name="gem-o" class="stock-icon" />
          <span>目前库存</span>
        </div>
        <div class="stock-right">
          <span class="stock-num">1</span>
          <span class="stock-unit">套</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-group">
        <van-button type="primary" round block @click="goHome">
          继续预约
        </van-button>
        <van-button
          plain
          round
          block
          hairline
          color="#b71c1c"
          @click="goHistory"
        >
          查看历史
        </van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  background: #f5f6fa;
}

.result-header {
  background: linear-gradient(180deg, #b71c1c 0%, #c62828 100%);
  padding: 20px;
  color: #fff;
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 2px;
}

.result-body {
  padding: 20px 16px 40px;
}

/* 进度条 */
.step-bar {
  margin-bottom: 24px;
}

.step-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  padding: 0 10px;
}

.step-line::before {
  content: "";
  position: absolute;
  top: 10px;
  left: 40px;
  right: 40px;
  height: 3px;
  background: #b71c1c;
  border-radius: 2px;
}

.step-dot-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  flex: 1;
}

.step-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e0e0e0;
  border: 3px solid #e0e0e0;
  transition: all 0.3s;
}

.step-dot.active {
  background: #b71c1c;
  border-color: #b71c1c;
}

.step-label {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
  text-align: center;
  white-space: nowrap;
}

.step-label.active {
  color: #333;
  font-weight: 500;
}

/* 成功区域 */
.success-section {
  text-align: center;
  margin-bottom: 24px;
}

.success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #b71c1c;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-bottom: 16px;
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.success-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.highlight {
  color: #b71c1c;
  font-weight: 600;
  font-size: 15px;
}

/* 信息卡片 */
.info-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.info-card-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-card-title .van-icon {
  color: #b71c1c;
  font-size: 18px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.info-value.id-card {
  font-family: "Courier New", Courier, monospace;
  letter-spacing: 1px;
}

/* 库存卡片 */
.stock-card {
  background: linear-gradient(90deg, #fff8f8, #fff);
  border: 1px solid #f5d0d0;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.stock-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #666;
}

.stock-icon {
  color: #b71c1c;
  font-size: 20px;
}

.stock-right {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.stock-num {
  font-size: 28px;
  font-weight: 700;
  color: #b71c1c;
  line-height: 1;
}

.stock-unit {
  font-size: 13px;
  color: #999;
}

/* 操作按钮 */
.action-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-group :deep(.van-button--primary) {
  background: linear-gradient(90deg, #b71c1c, #c62828);
  border: none;
  font-size: 15px;
  letter-spacing: 2px;
  height: 44px;
}
</style>
