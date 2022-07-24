<script lang="ts" setup>
import img from '../../../static/img/bg.jpeg'
import Cookies from "js-cookie";
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue';
import { useMyFetch } from '../../api/index'
import { storeToRefs } from "pinia";
import { mainStore } from "../../stores/counter";

// 实例化仓库
const store = mainStore();
// 解构并使数据具有响应式

const router = useRouter()

let username = ref<String>("")
let pwd = ref<String>("")

const login = async () => {
    const { data } = await useMyFetch(`/api/login?name=${username.value}&pwd=${pwd.value}`).json()
    if(data.value.status==='0')
        message.error("用户名或密码错误")
    if(data.value.status==='1'){
        if(data.value.description===1){
        message.success("登录成功!")
        Cookies.set("name",username.value as string,{ expires: 3 })
        router.push({name:"manage",params:data.value})
        }else{
        message.success("登录成功!")
        Cookies.set("name",username.value as string,{ expires: 3 })
        router.push({name:"game",params:data.value})
        }
    }
}
const back = () => {
    router.push({ name: "home" })
}


</script>


<template>
    <div class="bg">
        <img :src="img" alt="" />
        <div class="menu">
            <div class="input-field">
                <a-input id="name" placeholder="请输入用户名" v-model:value="username"></a-input>
            </div>
            <div class="input-field">
                <a-input id="pwd" placeholder="请输入密码" v-model:value="pwd"></a-input>
            </div>
            <div class="control-panel">
                <a-button class="ml" id="submit" type="primary" @click="back">返回</a-button>
                <a-button class="ml" id="submit" type="primary" @click="login">登录</a-button>
            </div>
        </div>
    </div>

</template>

<style lang="less" scoped>
.bg {
    position: relative;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    img {
        width: 100vw;
        height: 100vh;
        object-fit: cover;
    }

    .menu {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50vw;
        margin-left: -25vw;
        top: 30vh;
        left: 50%;

        >div {
            margin-top: 2vh;
            width: 20vw;
            display: flex;
            justify-content: space-around;

        }
        .ml{
            background-image: linear-gradient(#4b1111, #8b180b);
        }

    }
}
</style>