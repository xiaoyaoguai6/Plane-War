<template>
  <!-- using for minimap
    http://patorjk.com/software/taag/#p=display&f=Roman&t=code

                          .                                          oooo                .             
                        .o8                                          `888              .o8             
                      .o888oo  .ooooo.  ooo. .oo.  .oo.   oo.ooooo.   888   .oooo.   .o888oo  .ooooo.  
                        888   d88' `88b `888P"Y88bP"Y88b   888' `88b  888  `P  )88b    888   d88' `88b 
                        888   888ooo888  888   888   888   888   888  888   .oP"888    888   888ooo888 
                        888 . 888    .o  888   888   888   888   888  888  d8(  888    888 . 888    .o 
                        "888" `Y8bod8P' o888o o888o o888o  888bod8P' o888o `Y888""8o   "888" `Y8bod8P' 
                                                          888                                         
                                                          o888o                                        
  ============================================================================================================

  -->
  <div class="main"></div>
</template>

<style lang="less">
/* using for minimap
  ===============================================================================    
                                  .               oooo            
                                .o8               `888            
                      .oooo.o .o888oo oooo    ooo  888   .ooooo.  
                      d88(  "8   888    `88.  .8'   888  d88' `88b 
                      `"Y88b.    888     `88..8'    888  888ooo888 
                      o.  )88b   888 .    `888'     888  888    .o 
                      8oo888P'   "888"     .8'     o888o `Y8bod8P' 
                                      .o..P'                      
                                      `Y8P'      
  ===============================================================================                                      
*/
</style>

<script lang="ts">
/* using for minimap
  ===============================================================================    
                                               .o8            
                                              "888            
                      .ooooo.   .ooooo.   .oooo888   .ooooo.  
                      d88' `"Y8 d88' `88b d88' `888  d88' `88b 
                      888       888   888 888   888  888ooo888 
                      888   .o8 888   888 888   888  888    .o 
                      `Y8bod8P' `Y8bod8P' `Y8bod88P" `Y8bod8P'        

  ===============================================================================
 */

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VueComponentSkeleton',

  components: {},

  props: { title: { type: String, default: '' } },

  data: () => {
    return {};
  },

  computed: {
    // 计算属性
  },

  watch: {
    // 数据监听
  },

  beforeCreate() {
    // 在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。
  },

  created() {
    // 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，
    //  属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
  },

  beforeMount() {
    // 在挂载开始之前被调用：相关的 render 函数首次被调用。
  },

  mounted() {
    //
  },

  beforeUpdate() {
    // 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。 你可以
    // 在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
  },

  updated() {
    // 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
    // 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
    // 然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环
  },

  beforeUnmount() {
    // 实例销毁之前调用。在这一步，实例仍然完全可用。
  },

  unmounted() {
    // Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事
    // 件监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用。
  },

  activated() {
    //
  },

  deactivated() {
    //
  },

  errorCaptured() {
    //
  },

  methods: {
    // 方法定义
  },
});
</script>
