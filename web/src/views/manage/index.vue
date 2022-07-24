<template>
    <div class="bg">
        <img :src="img" alt="" />
        <div class="menu">
            <a-button type="primary" @click="StartGame">开始游戏</a-button>
            <a-button type="primary" @click="UserManagement">用户管理</a-button>
            <!-- <a-button type="primary" @click="back">返回</a-button> -->
        </div>
    </div>

</template>



<script lang="ts" setup>
import img from '../../../static/img/bg.jpeg'
import { useRouter,useRoute } from 'vue-router'
import { useMyFetch } from '../../api/index'
import { data } from 'jquery'
import { storeToRefs } from "pinia";
import { mainStore } from "../../stores/counter";
// 实例化仓库
const store = mainStore();
// 解构并使数据具有响应式
const { name } = storeToRefs(store);

const router = useRouter()
const route = useRoute()

name.value= route.params.name.toString();
const UserManagement = () => {
    router.push({name:"usermanagement"})
}
const StartGame = async () => {
    const { data } = await useMyFetch(`/api/score?name=${route.params.name}`).json()
    {
        console.log(data.value)
        router.push({name:"startgame",params:data.value})
       
    }
}



</script>

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
        width: 50vw;
        margin-left: -25vw;
        top: 30vh;
        left: 50%;

        >.ant-btn {
            margin-top: 2vh;
            width: 20vw;
            background-image: linear-gradient(#4b1111, #8b180b);
        }

    }
}
</style>