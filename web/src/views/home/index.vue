<script lang="ts" setup>
import img from '../../../static/img/xk.jpg'
import { useRouter } from 'vue-router'

const router =  useRouter()

const runto =  (value:string) => {
    router.push({name:value})
}


</script>


<template>
<div class="bg">
        <img :src="img" alt="" />
        <div class="menu">
             <h1 class="h1">the Plane War</h1>
            <a-button type="primary"  @click="runto('login')">登录</a-button>
            <a-button type="primary" @click="runto('register')">注册</a-button>
        </div>

    </div>
</template>

<style lang="less" scoped>
.bg {
    position: relative;
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
        width: 30vw;
        margin-left: -15vw;
        top: 30vh;
        left: 50%;
        .h1{
            color: rgb(203, 208, 170);
            font-size: 4.5em;
            line-height: 1;
            margin: 0;
            letter-spacing: -0.025em;
        }

        >.ant-btn {
            margin-top: 2vh;
            width: 20vw;
            background-image: linear-gradient(#4b1111, #8b180b);
        }

    }
}
</style>