<template>
  <div class="login-container">
    <!-- 使用element-plus的layout布局 -->
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login-form"
          :model="loginForm"
          :rules="rules"
          ref="loginFormRef"
        >
          <h2>Hello</h2>
          <h3>欢迎来到硅谷甄选</h3>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              :prefix-icon="User"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              :prefix-icon="Lock"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="isLoading"
              @click="loginHandler"
              class="login-btn"
              type="primary"
              size="default"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 导入图标
import { User, Lock } from "@element-plus/icons-vue";
import type { FormRules, FormInstance } from "element-plus";
import { reactive, ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import { reqLogin } from "@/api/user/index";
import { useRouter, useRoute } from "vue-router";
// import { ElNotification } from 'element-plus'
import { errorNotice, successNotice, getTimeStr } from "@/utils/tools";

// 账号和密码数据
let loginForm = reactive({ username: "admin", password: "111111" });
let isLoading = ref(false); // 按钮是否加载
// 表单
const loginFormRef = ref<FormInstance>();

const userStore = useUserStore();

const router = useRouter();

const route = useRoute();

// 验证的规则表单类型
interface RuleForm {
  username: string;
  password: string;
}

const validatorUsername = (rule: any, value: any, callback: any) => {
  // rule: 校验规则对象
  // value:表单元素的文本内容
  // callback: 函数：如果符合条件callback放行通过，如果不通过，注入错误提示信息
  if (value.length >= 5 && value.length <= 11) {
    callback();
  } else {
    callback(new Error("用户名5-11位"));
  }
};

const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6 && value.length <= 16) {
    callback();
  } else {
    callback(new Error(rule.message));
  }
};

// 增加验证规则配置对象
const rules = reactive<FormRules<RuleForm>>({
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'blur'},
    // { min: 5, max: 11, message: '用户名在5-11位之间', trigger: 'change'}
    // 自定义校验规则
    { trigger: "change", validator: validatorUsername },
  ],
  password: [
    // { required: true, message: '密码不能为空', trigger: 'blur'},
    // { required: true,  min: 6, max: 16, message: '密码在6-16位之间', trigger: 'change'}
    {
      required: true,
      min: 6,
      max: 16,
      message: "密码在6-16位之间",
      trigger: "change",
      validator: validatorPassword,
    },
  ],
});

const loginHandler = async () => {
  // 登录操作
  // 验证表单数据是否通过
  await loginFormRef.value?.validate();
  isLoading.value = true;

  const { code, data } = await reqLogin(loginForm);

  if (code === 200) {
    isLoading.value = false;
    // 登录成功
    const token = data;
    // 存储token
    userStore.setToken(token);
    const redirect: any = route.query.redirect;
    // 跳转到home页
    router.push({ path: redirect || "/" });
    // 提示登录成功
    let message = `HI,${getTimeStr()}好`;
    successNotice("欢迎回来", message);
  } else {
    isLoading.value = false;
    // 登录失败
    const message = data;

    errorNotice("登录失败", message);
  }
};
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;

  .login-form {
    position: relative;
    width: 80%;
    left: 0;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    // background-color: #fff;
    padding: 40px;
    color: #fff;
    h2 {
      font-size: 40px;
    }
    h3 {
      font-size: 30px;
      margin: 20px 0;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
