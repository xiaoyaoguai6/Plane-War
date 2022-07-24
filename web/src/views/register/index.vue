<script lang="ts" setup>
import img from '../../../static/img/bg.jpeg'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue';

const router = useRouter()

let username = ref<String>("")
let pwd = ref<String>("")
let pwdsec = ref<String>("")

const reg =  () => {
    if (pwd.value !== pwdsec.value) {
        message.error("两次输入的密码不一致")
        pwd.value = ' '
        pwdsec.value = ' '
        return
    }
    const data = {
        name: username.value,
        pwd: pwd.value
    }
    fetch(`/api/register`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json()
    }).then(res => {
        if (res.status === "1") {
            message.success("注册成功")
            fetch(`/api/update?name=${username.value}&score=0`).then(res=>{           
           return res.json()
    })
            router.push({ name: "login" })
        } else {
            message.error("注册失败，已存在该用户名！")
        }
    }).catch(err => {
        alert(err)
    })
}

const back = () => {
    router.push({ name: "home" })
}


</script>


<template>
    <div class="bg">
        <img :src="img" alt="" />
        <div class="menu">
            <form>
                <div class="input-field">
                    <a-input id="name" placeholder="请输入用户名" autocomplete='username' v-model:value="username" :maxlength="11" size="11"></a-input>
                </div>
                <div class="input-field">
                    <a-input-password id="pwd" placeholder="请输入密码" autocomplete='password' v-model:value="pwd" :maxlength="16" size="11"></a-input-password>
                </div>
                <div class="input-field">
                    <a-input-password id="pwdsec" placeholder="请再次输入密码" v-model:value="pwdsec" autocomplete='new-password' :maxlength="16" size="11"></a-input-password>
                </div>
                <div class="control-panel">
                    <a-button class="ml" id="back" type="primary" @click="back">返回</a-button>
                    <a-button class="ml" id="submit" type="primary" @click="reg">注册</a-button>
                </div>
            </form>
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
        width: 50vw;
        margin-left: -25vw;
        top: 30vh;
        left: 50%;

        div {
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