<template>
  <!-- SKU添加 -->
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input
        placeholder="SKU名称"
        v-model="skuInfoParams.skuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        v-model.number="skuInfoParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input
        placeholder="重量(克)"
        v-model="skuInfoParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        type="textarea"
        placeholder="SKU描述"
        v-model="skuInfoParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <!-- 多个属性 -->
      <el-form :inline="true" label-width="50px">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
          style="margin-bottom: 10px"
        >
          <el-select v-model="item.attrIdAndValueId" style="width: 200px">
            <el-option
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${item.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <!-- 多个属性 -->
      <el-form :inline="true" label-width="50px">
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select style="width: 200px" v-model="item.saleAttrValue">
            <el-option
              v-for="saleValue in item.spuSaleAttrValueList"
              :key="saleValue.id"
              :label="saleValue.saleAttrValueName"
              :value="`${item.id}:${saleValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="TableRef" row-key="id">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <!-- 添加按钮 -->
          <template #="{ row }">
            <el-button
              type="warning"
              v-if="skuInfoParams.skuDefaultImg != row.imgUrl"
              @click="defaultImgHandler(row)"
              >设置默认</el-button
            >
            <el-button v-else type="success" disabled>默认图片</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="saveSkuhandler"
        >保存</el-button
      >
      <el-button size="default" @click="cancelSku">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElTable } from "element-plus";

import { reqAddSkuInfo } from "@/api/product/sku";
import { reqAttrList } from "@/api/product/attr";
import {} from "@/api/product/attr";
import type {
  SkuInfo,
  SpuInfo,
  AttrInfo,
  SpuSaleAttr,
  SpuImage,
} from "@/api/product/type";
import { reqSpuSaleAttrList, reqSpuImgList } from "@/api/product/spu";

const emit = defineEmits<{
  (e: "changeScene", val: number): void;
}>();
// const multipleSelection = ref<any[]>([])
const TableRef = ref<InstanceType<typeof ElTable>>();

// 声明 skuInfoParam
const skuInfoParams = reactive<SkuInfo>({
  category3Id: null,
  skuName: "",
  spuId: null,
  tmId: null,
  price: null,
  weight: "",
  skuAttrValueList: [],
  skuDefaultImg: "",
  skuDesc: "",
  skuSaleAttrValueList: [],
});

// 平台属性列表
const attrArr = ref<AttrInfo[]>([]);
// 销售属性列表
const saleArr = ref<SpuSaleAttr[]>([]);

// 图片列表
const imgArr = ref<SpuImage[]>([]);

// 提供初始化方法对外暴露
const initSkuData = async (
  category1Id: number,
  category2Id: number,
  spu: SpuInfo,
) => {
  // 清空数据
  Object.assign(skuInfoParams, {
    category3Id: null,
    skuName: "",
    spuId: null,
    tmId: null,
    price: null,
    weight: "",
    skuAttrValueList: [],
    skuDefaultImg: "",
    skuDesc: "",
    skuSaleAttrValueList: [],
  });
  skuInfoParams.category3Id = spu.category3Id;
  skuInfoParams.spuId = spu.id as number;
  skuInfoParams.tmId = spu.tmId as number;
  // 1. 获取平台属性
  const attrResult = await reqAttrList(
    category1Id,
    category2Id,
    spu.category3Id,
  );
  // 2. 获取当前spu的销售属性
  const saleAttrResult = await reqSpuSaleAttrList(spu.id as number);

  // 3. 获取当前spu的图片列表
  const imgResult = await reqSpuImgList(spu.id as number);
  console.log(imgResult);

  // 设置
  attrArr.value = attrResult.data;
  saleArr.value = saleAttrResult.data;
  imgArr.value = imgResult.data;
};

// 图片
const defaultImgHandler = (row: any) => {
  // 按钮点击的时候，全部图片的复选框不勾选
  imgArr.value.forEach((item: any) => {
    TableRef.value?.toggleRowSelection(item, false);
  });
  // 选中的图片才勾选
  TableRef.value?.toggleRowSelection(row, true);
  // 收集图片地址
  skuInfoParams.skuDefaultImg = row.imgUrl;
};

// 保存
const saveSkuhandler = async () => {
  // 整理参数
  // 平台数据
  skuInfoParams.skuAttrValueList = attrArr.value.reduce(
    (prev: any, next: any) => {
      if (next.attrIdAndValueId) {
        const [attrId, valueId] = next.attrIdAndValueId.split(":");
        prev.push({
          attrId,
          valueId,
        });
      }
      return prev;
    },
    [],
  );
  // 销售属性
  skuInfoParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleAttrValue) {
        const [saleAttrId, saleAttrValueId] = next.saleAttrValue.split(":");
        prev.push({
          saleAttrId,
          saleAttrValueId,
        });
      }
      return prev;
    },
    [],
  );

  // 添加SKU
  const res = await reqAddSkuInfo(skuInfoParams);
  if (res.code === 200) {
    ElMessage.success("添加SKU成功");
    // 通知父组件
    emit("changeScene", 0);
  } else {
    ElMessage.error("添加SKU失败");
  }
};

// 取消按钮
const cancelSku = () => {
  // scene切换
  emit("changeScene", 0);
};

defineExpose({ initSkuData });
</script>

<style lang="scss" scoped></style>
