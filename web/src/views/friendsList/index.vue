<template>
    <div class="bg">
        <img :src="img" alt="" />
        <div class="menu">
            <a-button type="primary">查看好友</a-button>
            <div>
                <a-button type="primary" @click="showApplicationListModal">申请列表</a-button>
                <a-modal v-model:visible="ApplicationListVisible" title="好友申请列表" @ok="handleOk">
                    <div style="margin-top:20px">
                        <div v-if="ApplicationList.length===0">暂无好友申请</div>
                        <div v-else v-for="item in ApplicationList" :key="item.Id"
                            style="display:flex;justify-content: space-between;margin:5px;">
                            <div>用户名：{{ item.Name }} </div>
                            <div>
                                <div v-if="item.Status === 0">
                                    <a-button type="primary" style="margin-right:5px" @click="changefri(item.Id,1)">同意</a-button>
                                    <a-button type="primary" danger @click="changefri(item.Id,2)">拒绝</a-button>
                                </div>
                                <a-tag color="#87d068" v-else-if="item.Status === 1">已同意</a-tag>
                                <a-tag color="error" v-else>已拒绝</a-tag>
                            </div>
                        </div>
                    </div>
                </a-modal>
            </div>
            <div>
                <a-button type="primary" @click="showAddFriendModal">添加好友</a-button>
                <a-modal v-model:visible="visible" title="输入要添加的好友姓名" @ok="handleOk">
                    <a-input-search v-model:value="value" placeholder="输入要加好友的姓名" enter-button @search="onSearch" />
                    <div style="margin-top:20px">
                        <div v-for="item in SearchuserList"
                            style="display:flex;justify-content: space-between;margin:5px;">
                            <div>{{ item }} </div>
                            <a-tag color="pink" v-if="item === username" style="margin:0">本人</a-tag>
                            <!-- <a-tag color="pink" v-if="item===username" style="margin:0">申请中</a-tag> -->
                            <div @click="addfriend(item)" v-else>添加</div>
                        </div>
                    </div>
                </a-modal>
            </div>
        </div>
    </div>

</template>



<script lang="ts" setup>
import img from '../../../static/img/bg.jpeg'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import Cookies from 'js-cookie';
import { message } from 'ant-design-vue';

const router = useRouter()

//获取本人姓名
const username = ref<string>("")


onMounted(() => {
    username.value = <string>Cookies.get("username")
})

//申请列表
interface ApplicationObj {  //申请对象
    Name: string,
    Status: number,
    Id: string
}
const ApplicationList = ref<ApplicationObj[]>([])
const ApplicationListVisible = ref<boolean>(false)
const getApplicationList = () => {
    fetch(`/api/list/FriendRequest/${username.value}`).then(res => {
        return res.json()
    }).then(res => {
        ApplicationList.value = <ApplicationObj[]>[]
        res.list.map((x: ApplicationObj) => {
            ApplicationList.value.push(x)
        })
    })
}
const changefri = async (id:string,status:number)=>{
    await fetch(`/api/list/FriendRequest/${id}/${status}`,{method:"put"}).then(res=>{
        return res.json()
    }).then(res=>{
        console.log(res)
        if(res.status==="1"){
            if(status===1)
            message.success("已同意")
            else 
            message.error("已拒绝")
        }
        else  message.error("res.data")
    }).catch(err=>{
        console.log(err)
    })
    getApplicationList()
}
const showApplicationListModal = () => {  //打开申请列表框
    getApplicationList()
    ApplicationListVisible.value = true
}

//添加好友
const value = ref<string>("")
const visible = ref<boolean>(false);
const SearchuserList = ref<string[]>([])
const showAddFriendModal = () => {
    visible.value = true;
};
const handleOk = () => {
    visible.value = false;
};
const onSearch = () => {   //搜索好友
    fetch(`/api/list/getUser?name=${value.value}`).then(res => {
        return res.json()
    }).then(res => {
        SearchuserList.value = <string[]>[]
        res.list.map((x: string) => SearchuserList.value.push(x))
    })
}
const addfriend = async (value: string) => {  //申请成为好友
    const onlyUuid = uuidv4()
    const data = {
        user_name: username.value,
        friend_name: value,
        id: onlyUuid
    }
    await fetch(`/api/list/addFriend`, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json()
    }).then(res => {
        console.log(res)
    })
}

</script>

<style lang="less" scoped>
.bg {
    position: relative;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;

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

        .ant-btn {
            margin-top: 2vh;
            width: 50vw;

        }



    }

    .list {
        margin-top: 20px;
        display: flex !important;

        >div {
            font-size: 30px;
        }
    }
}
</style>