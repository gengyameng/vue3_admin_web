<template>
  <!-- 品牌管理 - 信息集中在卡片中 -->
  <el-card>
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" icon="Plus" @click="addTrademarkHandler"
      v-has="`btn.Trademark.add`"
      >添加品牌</el-button
    >
    <!-- 表格组件：展示已有得平台数据 -->
    <el-table border style="margin: 10px" :data="trademarkRecords">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row }">
          <img
            :src="row.logoUrl"
            alt="无法渲染"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademarkHandler(row)"
          ></el-button>
          <!-- 气泡确实是否删除 -->
          <el-popconfirm
            :title="`您确定要删除${row.tmName}`"
            icon="Delete"
            width="250px"
            @confirm="deleteTrademarkHandler(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
    page-sizes： 设置每页显示多少条数据的下拉菜单数据 
    layout:可以设置分页器6个子组件的布局 ->标识后面的内容会在右侧
    -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="PAGE_SIZE"
      background
      layout=" prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getHasTrademark"
      @size-change="getHasTrademark"
    />
    <!-- 对话框-添加按钮和删除按钮点击时弹出 -->
    <el-dialog
      v-model="dialogVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      width="800"
    >
      <el-form
        ref="trademarkFormRef"
        label-width="100px"
        :model="trademarkParams"
        :rules="rules"
        style="width: 80%"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkParams.tmName" />
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelHandler">取消</el-button>
          <el-button type="primary" @click="confirmHandler"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import {
  type UploadProps,
  ElMessage,
} from "element-plus";

import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from "@/api/product/trademark";
import type { Records } from "@/api/product/type";
import { PAGE_SIZE } from "@/settings";

// 当前页码
let currentPage = ref<number>(1);

// pageSize 每一页展示多少条数据
let pageSize = ref<number>(3);

// 总共多少条数据
let total = ref<number>(100);

// trademarkRecords 数据
let trademarkRecords = ref<Records>([]);

// 控制对话框dialog是否显示
const dialogVisible = ref(false);

// 品牌表单参数
const trademarkParams = reactive({
  id: 0,
  tmName: "",
  logoUrl: "",
});

// el-form组件实例
const trademarkFormRef = ref();

// 获取已有品牌数据 接口封装
const getHasTrademark = async () => {
  const { code, message, data, ok } = await reqHasTrademark(
    currentPage.value,
    pageSize.value,
  );

  if (code === 200) {
    // 存储已有品牌总个数
    total.value = data.total;
    trademarkRecords.value = data.records;
  }
};

// 组件挂载完毕钩子
onMounted(async () => {
  // 发送请求获取已有品牌数据
  getHasTrademark();
});

// 添加品牌
const addTrademarkHandler = async () => {
  // dialog框显示
  dialogVisible.value = true;
  // 清空trademarkParams
  trademarkParams.id = 0;
  trademarkParams.logoUrl = "";
  trademarkParams.tmName = "";

  // 清理表单验证信息
  nextTick(() => {
    trademarkFormRef.value.clearValidate(["tmName", "logoUrl"]);
  });
};

// 更新品牌
const updateTrademarkHandler = (data: any) => {
  // 清空校验规则信息
  nextTick(() => {
    trademarkFormRef.value.clearValidate("tmName");
    trademarkFormRef.value.clearValidate("logoUrl");
  });
  dialogVisible.value = true;
  trademarkParams.id = data.id;
  trademarkParams.tmName = data.tmName;
  trademarkParams.logoUrl = data.logoUrl;
};

// tmName验证规则
const validatorTmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback();
  } else {
    callback(new Error("品牌名称位数大于等于两位"));
  }
};

// validatorLogoUrl 验证规则
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  // 如果图片上传
  if (value) {
    callback();
  } else {
    callback(new Error("LOGO图片必须上传"));
  }
};

// 表单验证规则
const rules = {
  tmName: [{ required: true, trigger: "change", validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
};

// confirmHandler 确认按钮
const confirmHandler = async () => {
  // 表单验证
  await trademarkFormRef.value.validate();
  // 发送请求
  const res = await reqAddOrUpdateTrademark(trademarkParams);
  if (res.code === 200) {
    // 成功
    // 关闭dialog
    dialogVisible.value = false;
    // 提示成功
    const message = trademarkParams.id ? "修改品牌成功" : "添加品牌成功";
    ElMessage.success(message);
    // 从新获取已有品牌
    getHasTrademark();
  } else {
    dialogVisible.value = false;
    // 提示失败
    const message = trademarkParams.id ? "修改品牌失败" : "添加品牌失败";
    ElMessage.error(res.data);
  }
};

// cancelHandler 取消按钮
const cancelHandler = () => {
  dialogVisible.value = false;
};

// 删除品牌操作
const deleteTrademarkHandler = async (id: number) => {
  const res = await reqDeleteTrademark(id);
  if (res.code === 200) {
    // 删除成功提示信息
    ElMessage.success("删除品牌成功");
    // 重新获取已有的品牌数据
    getHasTrademark();
  } else {
    ElMessage.error("删除品牌失败");
  }
};

// 图片上传之前触发的钩子
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (
    rawFile.type === "image/jpeg" ||
    rawFile.type === "image/png" ||
    rawFile.type === "image.gif"
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传文件大小小于4M",
      });
      return false;
    }
  } else {
    ElMessage.error("上传文件格式务必PNG|JPG|GIF");
    return false;
  }
};

// 图片上传成功钩子
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile,
) => {
  // response:为当前这次上传图片post请求服务器返回的数据
  // 收集上传的图片地址
  trademarkParams.logoUrl = response.data;
};
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
