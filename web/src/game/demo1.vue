<template>
  <div ref="webgl" class="canvas"></div>
  <div class="game-holder">
    <div class="header">
      <h1><span>the</span> Plane War</h1>
      <div class="score" id="score">
        <div class="score__content" id="dist">
          <div class="score__label">distance</div>
          <div class="score__value score__value--dist">{{ score }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="replay">
    <a-button
      class="ml"
      type="primary"
      id="submit"
      @click="again"
      v-if="status == 1"
      >Click to try again</a-button
    >
  </div>
  <div class="message message--replay" id="replayMessage">
    gameover<br />
    This time is {{ score }}<br />
    best time is {{ best }}<br />
  </div>
</template>

<script  setup >
import { onMounted, watch,ref } from 'vue';
import { renderer } from './JS/demo.js';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { mainStore } from '../stores/counter';
import { useMyFetch } from '../api/index';

// 实例化仓库
const store = mainStore();
// 解构并使数据具有响应式
const { status } = storeToRefs(store);
const { name } = storeToRefs(store);
const { score } = storeToRefs(store);
// const { da } = storeToRefs(store);

const route = useRoute();
const router = useRouter();
console.log(status.value);

const best = ref(JSON.parse(route.params.list ).score)
// console.log(JSON.parse(route.params.list).score);


var j = 0;
// if(status.value==1&&score>best){
//      const { data } = await useMyFetch(`/api/update?name=${name.value}&score=${score}`).json()
//     {
//         console.log(data.value)
//     }
// }
watch(status, (newval2) => {
  console.log(newval2);
  if (newval2 == 1) {
    replayMessage.style.display = 'block';
  }

  if (newval2 == 1 && j > best.value) {
    useMyFetch(`/api/update?name=${name.value}&score=${j}`).json();
  }
}),
  watch(score, (newval) => {
    console.log(newval);
    j = newval;
  });
// var fieldDistance
// fieldDistance = document.getElementById("distValue");
// fieldDistance.innerHTML=score;
// name: "HelloWorld",
// created(()=>{

// })
// this.$refs.webgl.appendChild(renderer.domElement);//不可以
// Three.js渲染结果Canvas画布插入到body元素中
onMounted(() => {
  document.body.appendChild(renderer.domElement); //可以访问body
});
// const functionForJs = (data)=>{
//   console.log(data)
// }

// console.log(status.value)

// this.$refs.webgl.appendChild(renderer.domElement);
// // Three.js渲染结果Canvas画布插入到body元素中
// document.body.appendChild(renderer.domElement);

// methods: {
// again(){
//
// }}
const again = () => {
  status.value = 0;
  score.value = 0;
  // router.push({name:"game",params:da.value})
  fetch(`/api/score?name=${name.value}`).then(res=>{
    return res.text()
  }).then(res=>{
    best.value=JSON.parse(JSON.parse(res).list).score
  });
  replayMessage.style.display = 'none';
  console.log(data,'aaa')
  // best.value=JSON.parse(data.value ).score
  
};
</script>
<style>
body {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(0x23190f);
}
.header {
  position: absolute;
  top: 8vh;
  left: 0;
  width: 100%;
  text-align: center;
  pointer-events: none;
}
.header h1 {
  font-family: 'Playfair Display';
  font-size: 4.5em;
  line-height: 1;
  margin: 0;
  letter-spacing: -0.025em;
  color: coral;
}
.header h1 span {
  font-size: 0.2em;
  font-style: italic;
  display: block;
  margin: 0 0 -1.5em -7em;
  letter-spacing: 0px;
}
.game-holder {
  position: absolute;
  width: 100%;
  height: 100%;
}
.score {
  width: 100%;
  margin: 2em 0 0;
  text-align: center;
  white-space: nowrap;
}
.score__label {
  font-size: 9px;
  position: relative;
  margin: 0 0 0.5em 0;
  text-align: center;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgb(42, 229, 233);
}
.score__value {
  font-family: 'Playfair Display';
  font-weight: bold;
  color: rgb(42, 229, 233);
}

.score__value--dist {
  font-size: 30px;
}
.message {
  top: 50vh;
  font-weight: bold;
  position: absolute;
  left: 0;
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  pointer-events: none;
}

.message--replay {
  font-size: 1.25vw;
  bottom: 40vh;
  display: none;
  text-indent: 0.5em;
  letter-spacing: 0.5em;
  color: #d1b790;
}
.replay {
  background: #23190f;
}
.ml {
  background: #23190f;
  align-items: center;
  left: 100vh;
  top: 70vh;
}
</style>