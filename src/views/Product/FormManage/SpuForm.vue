<template>
  <!-- SPU添加/编辑 -->
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input v-model="SpuInfoParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select
        placeholder="请选择品牌"
        v-model="SpuInfoParams.tmId"
        style="width: 200px">
        <el-option
          v-for="item in trademarkArr" :key="item.id"
          :label="item.tmName" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" v-model="SpuInfoParams.description"/>
    </el-form-item>
    <el-form-item label="SPU照片">
      <!-- 照片墙 -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}` : '无'" style="width: 200px" v-model="saleAttrIdAndValueName">
        <el-option v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name" :value="`${item.id}:${item.name}`" />
      </el-select>
      <el-button
        type="primary"
        :disabled="saleAttrIdAndValueName ? false : true"
        icon="Plus" style="margin-left:10px" @click="addSaleAttrHandler">添加销售属性</el-button>
      <el-table border style="margin: 10px 0px" :data="SpuInfoParams.spuSaleAttrList">
        <el-table-column label="序号" align="center" type="index" width="80"></el-table-column>
        <el-table-column label="属性名" width="120" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值">
          <template #="{ row }">
            <el-tag
              style="margin:0 5px;"
              type="primary" v-for="item in row.spuSaleAttrValueList"
              :key="item.id">{{ item.saleAttrValueName }}</el-tag>
            <!-- 输入和按钮 -->
            <el-input
              v-if="row.flag === true"
              v-model="row.saleAttrValue"
              placeholder="请输入属性值"
              size="small"
              style="width: 100px"
              @blur="toLookSaleValue(row)"
            ></el-input>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="Plus"
              @click="toEditSaleValue(row)"
            >
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #="{ row, $index }">
            <el-button type="danger" size="small" icon="Delete" @click=deleteSaleAttr($index)></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="saveSpuInfo">保存</el-button>
      <el-button size="default" @click="cancelSpu">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue'

import type { SpuInfo, SPUValue, SpuInfoResponseData, Trademark, SaleAttr, SpuSaleAttr, SpuSaleAttrValue, SpuImage } from '@/api/product/type'
import { reqSpuInfo, reqSaleAttrList, reqAddOrUpdateSpuInfo } from '@/api/product/spu'
import { reqAllTrademarkList } from '@/api/product/trademark'
import { ElMessage } from 'element-plus';

const emit = defineEmits<{
  (e: 'changeScene', val: number): void
}>()

// spuInfo 数据
const SpuInfoParams = reactive<SpuInfo>({
  spuName: '',
  description: '',
  category3Id: null,
  spuSaleAttrList: [],
  spuImageList: [],
  spuPosterList: [],
})

// trademarkArr
const trademarkArr = ref<Trademark[]>([])

// const trademarkId = ref<number>()


// 所有销售属性列表
const allSaleAttrArr = ref<SaleAttr[]>([])
// 当前SPU销售属性
const spuSaleAttrArr = ref<SpuSaleAttr[]>([])

//商品图片 -存放商品图片
let imgList = ref<SpuImage[]>([]);
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);
//存储预览图片地址
let dialogImageUrl = ref<string>('')

//将来收集还未选择的 销售属性的ID:属性值的名字
let saleAttrIdAndValueName = ref<string>('')

// 定义数据初始化方法-spu更新时使用
const initHasSpuData = async(spuData: SPUValue) => {
  // trademarkId.value = spuData.tmId
  // 获取spu详情
  const spuInfoResult: SpuInfoResponseData = await reqSpuInfo(spuData.id)
  
  const spuInfoData = spuInfoResult.data
  // 获取三级分类下品牌
  const trademarkResult = await reqAllTrademarkList()
  console.log('trademarkResult',trademarkResult);

  // 销售属性列表
  const saleAttrResult = await reqSaleAttrList()
  // 图片上传必须为 name + url
  Object.assign(SpuInfoParams, JSON.parse(JSON.stringify(spuInfoData)))
  imgList.value = spuInfoData.spuImageList.map(item => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })

  spuSaleAttrArr.value = SpuInfoParams.spuSaleAttrList
  trademarkArr.value = trademarkResult.data
  allSaleAttrArr.value = saleAttrResult.data
}

// 定义数据初始化方法-添加SUP初始化请求方法
const initAddSupData = async (categoryId: number) => {
  // 清空数据
  Object.assign(SpuInfoParams, {
    spuName: '',
    description: '',
    category3Id: null,
    spuSaleAttrList: [],
    spuImageList: [],
    spuPosterList: [],
    tmId: null
  })
  // 清空照片
  imgList.value = []
  // 清空销售属性
  spuSaleAttrArr.value = SpuInfoParams.spuSaleAttrList
  saleAttrIdAndValueName.value = ''
  // 存储三级分类
  SpuInfoParams.category3Id = categoryId
  // 获取三级分类下品牌
  const trademarkResult = await reqAllTrademarkList()
  // 销售属性列表
  const saleAttrResult = await reqSaleAttrList()
  // 存储数据
  trademarkArr.value = trademarkResult.data
  allSaleAttrArr.value = saleAttrResult.data
}



// 照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url;
  // 对话框弹出来
  dialogVisible.value = true
}

// 照片墙删除文件钩子
const handleRemove = () => {
  console.log(123);
  console.log(SpuInfoParams.spuImageList);
  
}

// 照片墙上传成功之前的钩子函数-约束文件大小与类型
const handleUpload = (file: any) => {
  if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/git') {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage.error('上传文件务必小于3M')
    }
  } else {
    ElMessage.error('上传文件务必PNG|JPG|GIF')
  }
  return false
}

// 销售属性
// 添加销售属性
const addSaleAttrHandler = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  // 插入 SpuInfoParams.spuSaleAttrList
  SpuInfoParams.spuSaleAttrList.push({
    baseSaleAttrId: +baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList:[]
  })
  
  // 清空数据
  saleAttrIdAndValueName.value = ''
  
}

// 销售属性值
// 1.展示销售属性值 input失去焦点
const toLookSaleValue = (row: SpuSaleAttr) => {
  // saleAttrValue加入到spuSaleAttrValueList
  // row.flag = false 清空row.saleAttrValue
  const { saleAttrValue, baseSaleAttrId } = row
  row.flag = false
  
  // 1.不能为空
  if (saleAttrValue?.trim() === '') return
  // 2. 不能重复
  let repeat = row.spuSaleAttrValueList.find(item => {
    return item.saleAttrValueName === saleAttrValue
  })

  if (repeat) {
    ElMessage.error('属性值不能重复')
    return
  }
  // 追加新的属性值对象
  const newSaleAttrValue: SpuSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue?.trim() as string
  }
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.saleAttrValue = ''
}

// 2. 编辑销售属性
const toEditSaleValue = (row: SpuSaleAttr) => {
  // row.flag = true 清空row.saleAttrValue
  row.flag = true
  row.saleAttrValue = ''
}

// 删除销售属性
const deleteSaleAttr = ($index: number) => {
  SpuInfoParams.spuSaleAttrList.splice($index, 1)

}

// 取消按钮点击
const cancelSpu = () => {
  // 切换scene
  emit('changeScene', 0)
}

// 保存按钮
const saveSpuInfo = async () => {
  // 整理参数
  // 将imgList数据转换保存到SpuInfoParams
  SpuInfoParams.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url
    }
  })  

  // 发送请求
  const res = await reqAddOrUpdateSpuInfo(SpuInfoParams)
  if (res.code === 200) {
    // 保存/添加成功
    ElMessage.success(SpuInfoParams.id ? '更新成功': '添加成功')
    // 清空SpuInfoParams
    Object.assign(SpuInfoParams,{
      spuName: '',
      description: '',
      category3Id: null,
      spuSaleAttrList: [],
      spuImageList: [],
      spuPosterList: []
    })
    // 通知父组件切换场景0
    emit('changeScene', 0)
  } else {
    ElMessage.error(SpuInfoParams.id ? '更新失败': '添加失败')
  }

}

// 计算属性 计算出当前SPU未拥有的销售属性
const unSelectSaleAttr = computed(() => {
  // 全部销售属性：颜色 版本 尺码
  // 已拥有的 颜色 版本
  let unSelectArr = allSaleAttrArr.value.filter(item => {
    return spuSaleAttrArr.value.every(item1 => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

// 对外暴露
defineExpose({initHasSpuData, initAddSupData})
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
