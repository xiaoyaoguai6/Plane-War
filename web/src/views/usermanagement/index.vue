<template>
    <div class="bg">
      <img :src="img" alt="" />
        <div class="menu">
            <!-- <a-button type="primary" @click="StartGame">开始游戏</a-button> -->
            <a-button type="primary" @click="UserManagement">查看用户</a-button>
            <a-button type="primary" @click="back">返回</a-button>
        </div>
        <div class="app">

        </div>
         <a-table :columns="columns" :data-source="data" :pagination="false">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.Name }}
        </a>
      </template>
      <!-- <template v-else-if="column.key === 'status'">
        <a>
          {{ record.Status }}
        </a>
      </template> -->
      <template v-if="column.key === 'description'">
        <a>
          {{ record.Description }}
        </a>
      </template>
      <template v-if="column.key === 'pwd'">
        <a>
          {{ record.Pwd }}
        </a>
      </template>
      
    </template>
  </a-table>
    </div>

</template>

<script lang="ts" setup>
import img from '../../game/jpg/fj.jpg'
import { useMyFetch } from '../../api/index'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
const UserManagement =()=>{
      fetch(`/api/list`).then(res=>{
           return res.json()
      }).then(v=>{
          v.list.map((x:t)=>{
              data.value.push(x)
          })
         console.log(data)
        message.success('查看成功');
      }).catch(err=>{
        console.log(err);
      });
}
interface t{
    Name:string,
    Status:number,
    Description:string,
    Pwd:string
}
const data = ref<t[]>([])

const back = () => {
    router.push({ name: "login" })
}
const StartGame = () => {
    router.push({name:"startgame"})
}

const router = useRouter()

const columns = [
  {
    name: 'Name',
    key: 'name'
  },

  {
    title: 'Description',
    key: 'description'

  },
  {
    title: 'Pwd',
    key: 'pwd'

  },

];
</script>

<style lang="less" scoped>
.bg {
    position: relative;
    box-sizing: border-box;
    img {
        width: 80vw;
        height: 50vh;
        object-fit: contain;
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
            background: rgb(132, 197, 237);
        }

    }
}
</style>