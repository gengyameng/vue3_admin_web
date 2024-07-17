<template>
  <!-- 卡片 -->
  <el-card>
    <!-- 表格 -->
    <el-table border style="margin-bottom: 15px" :data="skuRecords">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="200px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="200px"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="默认图片" width="200px">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量(g)"
        width="200px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格(元)"
        width="200px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row }">
          <!-- 四个按钮 -->
          <!-- 上架/下架 -->
          <el-button
            type="success"
            size="small"
            icon="Top"
            v-if="row.isSale === 0"
            @click="onSaleSkuHandler(row.id)"
          ></el-button>
          <el-button
            v-else
            type="info"
            size="small"
            icon="Bottom"
            @click="cancelSkuHandler(row.id)"
          ></el-button>
          <!-- 编辑 -->
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateSku"
          ></el-button>
          <!-- 展示 -->
          <el-button
            type="info"
            size="small"
            icon="View"
            @click="viewSkuHandler(row.id)"
          ></el-button>
          <!-- 删除 -->
          <el-popconfirm
            title="确定要删除吗?"
            @confirm="deleteSkuHandler(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="PAGE_SIZE"
      background
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="getSkuList"
      @current-change="getSkuList"
    />
    <!-- 抽屉 - 详情 -->
    <el-drawer v-model="drawer" direction="rtl">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <!-- 布局组件 -->
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 2px 5px"
              type="danger"
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              >{{ attr.valueName }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 2px 5px"
              type="success"
              v-for="sale in skuInfo.skuSaleAttrValueList"
              :key="sale.id"
              >{{ sale.saleAttrValueName }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="img in skuInfo.skuImageList"
                :key="img.id"
              >
                <img
                  :src="img.imgUrl"
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import { PAGE_SIZE } from "@/settings";
import {
  reqAllSkuList,
  reqSaleSku,
  reqCancelSku,
  reqDeleteSku,
  reqFindSku,
} from "@/api/product/sku";
import type { SkuInfo } from "@/api/product/type";
import { ElMessage } from "element-plus";

// 当前页码
let currentPage = ref<number>(1);

// pageSize 每一页展示多少条数据
let pageSize = ref<number>(PAGE_SIZE[0]);

// 总共多少条数据
let total = ref<number>(0);

// SKU记录
let skuRecords = ref<SkuInfo[]>([]);

// SKUinfo 展示详情
let skuInfo = ref<any>({});

// 控制抽屉组件是否打开
let drawer = ref(false);

// 组件挂载完毕钩子
onMounted(() => {
  // 组件挂载完毕，请求获取SKU列表
  getSkuList();
});

// 按钮点击事件
// 1.上架sku
const onSaleSkuHandler = async (skuId: number) => {
  const res = await reqSaleSku(skuId);
  if (res.code === 200) {
    // 上架成功
    ElMessage.success("上架成功");
    // 页面刷新
    getSkuList();
  } else {
    ElMessage.error(res.data);
  }
};

// 2.下架SKu
const cancelSkuHandler = async (skuId: number) => {
  const res = await reqCancelSku(skuId);
  console.log(res);

  if (res.code === 200) {
    // 下架成功
    ElMessage.success("下架成功");
    // 页面刷新
    getSkuList();
  } else {
    ElMessage.error(res.data);
  }
};

// 3. 删除sku
const deleteSkuHandler = async (skuId: number) => {
  const res = await reqDeleteSku(skuId);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    getSkuList();
  } else {
    ElMessage.error(res.data);
  }
};

// 4. 查看sku
const viewSkuHandler = async (skuId: number) => {
  // 抽屉打开
  drawer.value = true;
  // 获取SKU详情
  const { code, data } = await reqFindSku(skuId);
  if (code === 200) {
    skuInfo.value = data;
  }
};

// 编辑sku
const updateSku = () => {
  ElMessage.success("开发中...");
};

// 获取全部SKu列表
const getSkuList = async () => {
  const { code, data } = await reqAllSkuList(currentPage.value, pageSize.value);
  if (code === 200) {
    console.log(data);

    // 存储数据
    skuRecords.value = data.records;
    total.value = data.total;
  }
};
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
