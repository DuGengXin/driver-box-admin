<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';

import type { Device } from '#/api/types';

import { onMounted, ref } from 'vue';

import { AnalysisOverview } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';

import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue';
import { Button, Card, FormItem, Input, Switch } from 'ant-design-vue';

import { getAllDeviceApi } from '#/api/core/devices';

const devices = ref<Device[]>();

const devicesVo = ref<Device[]>();

const options = ref({
  id: '',
  modelName: '',
  online: true,
});

const overviewItems = ref<AnalysisOverviewItem[]>([
  {
    icon: createIconifyIcon('material-symbols-light:devices-sharp'),
    title: '在线设备',
    totalTitle: '总设备数',
    totalValue: 0,
    value: 0,
  },
  {
    icon: createIconifyIcon('mdi:offline'),
    title: '设备断线',
    totalTitle: '总设备数',
    totalValue: 0,
    value: 0,
  },
  {
    icon: createIconifyIcon('carbon:model-builder'),
    title: '设备种类',
    totalTitle: '总设备数',
    totalValue: 0,
    value: 0,
  },
]);

// 将输入字符串转义为正则表达式
function escapeRegExp(string: string) {
  return string.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`); // $& 表示整个匹配的字符串
}

function filterDevicesVo() {
  if (!devices.value) return;
  devicesVo.value = devices.value.filter((device: Device) => {
    if (options.value.id) {
      const idPattern = new RegExp(escapeRegExp(options.value.id), 'i'); // 'i' 表示不区分大小写
      if (!idPattern.test(device.id)) {
        return false;
      }
    }

    if (options.value.modelName) {
      const modelNamePattern = new RegExp(
        escapeRegExp(options.value.modelName),
        'i',
      );
      if (!modelNamePattern.test(device.modelName)) {
        return false;
      }
    }
    return options.value.online === device.online;
  });
}

function loadStatistics() {
  if (!devices.value) return;
  if (overviewItems.value && overviewItems.value[0]) {
    overviewItems.value[0].totalValue = devices.value.length;
    overviewItems.value[0].value = devices.value.filter(
      (el) => el.online,
    ).length;
  }
  if (overviewItems.value && overviewItems.value[1]) {
    overviewItems.value[1].totalValue = devices.value.length;
    let sum = 0;
    devices.value.forEach((el) => {
      sum += el.disconnectTimes;
    });
    overviewItems.value[1].value = sum;
  }
  if (overviewItems.value && overviewItems.value[2]) {
    overviewItems.value[2].totalValue = devices.value.length;
    const models: any[] = [];
    devices.value.forEach((el) => {
      models.push(el.modelName);
    });
    overviewItems.value[2].value = new Set(models).size;
  }
}

const loadAllDevice = async () => {
  devices.value = await getAllDeviceApi();
  // 排序
  devices.value.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  filterDevicesVo();
  loadStatistics();
};

onMounted(() => {
  loadAllDevice();
});
</script>

<template>
  <div class="p-5">
    <AnalysisOverview :items="overviewItems" />
    <div class="mt-4 flex w-full items-center justify-center">
      <Card class="w-full" title="筛选">
        <div class="flex flex-wrap">
          <FormItem class="w-1/5" label="ID">
            <Input
              v-model:value="options.id"
              allow-clear
              @keydown.enter="loadAllDevice"
            />
          </FormItem>
          <FormItem class="ml-5 w-1/5" label="类型">
            <Input
              v-model:value="options.modelName"
              allow-clear
              @keydown.enter="loadAllDevice"
            />
          </FormItem>
          <FormItem class="ml-5 w-1/5" label="是否在线">
            <Switch v-model:checked="options.online" @change="loadAllDevice" />
          </FormItem>
        </div>
        <template #actions>
          <Button @click="loadAllDevice">搜索</Button>
        </template>
      </Card>
    </div>
    <div class="mt-4 flex w-full items-center justify-end">
      <Button type="primary">
        <template #icon><AppstoreAddOutlined /></template>
        添加设备
      </Button>
    </div>
    <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <template v-for="device in devicesVo" :key="device.id">
        <Card
          class="w-full transform rounded-lg p-2 shadow-lg transition-transform duration-300 hover:scale-105"
        >
          <template #title>
            <h2 class="mb-2 text-2xl font-extrabold text-blue-400">
              {{ device.id }}
            </h2>
          </template>
          <template #extra>
            <p class="mb-1">
              <span :class="device.online ? 'text-green-400' : 'text-red-400'">
                {{ device.online ? '在线' : '离线' }}
              </span>
            </p>
          </template>
          <template #actions>
            <EyeOutlined key="look" :style="{ fontSize: '26px' }" />
            <EditOutlined key="edit" :style="{ fontSize: '26px' }" />
            <DeleteOutlined key="delete" :style="{ fontSize: '26px' }" />
          </template>
          <p class="mb-1">
            <span class="font-semibold text-gray-400">类型:</span>
            {{ device.modelName }}
          </p>

          <p class="mb-1">
            <span class="font-semibold text-gray-400">TTL:</span>
            {{ device.ttl }}
          </p>
          <p class="mb-1">
            <span class="font-semibold text-gray-400">断线次数:</span>
            {{ device.disconnectTimes }}
          </p>
          <p class="mt-3 text-sm text-gray-500">
            <span class="font-semibold">数据更新时间:</span>
            {{ new Date(device.updatedAt).toLocaleString() }}
          </p>
        </Card>
      </template>
    </div>
  </div>
</template>
