<template>
      <q-card style="width: 100%" class="bg-teal text-white">
      <q-img src="~assets/gpslocation.jpg"/>
      <q-btn class="AClass" flat round icon="close" color="black" v-close-popup />         
     
      <q-card-section>
        <div class="text-h6">Green Power Solution</div>
        <div class="text-subtitle2">
            3/280, Sivasakthi Colony,
            Dharapuram road,
            Udumalpet (T.K),
            Thirupur (D.T),
            Tamilnadu (S.T),
            India. 
            642126
        </div>
      </q-card-section>
      <q-card-section>
          <div class="row">
            <q-icon name="phone"/>
            <q-item-label class="q-pl-sm">   +918754199499</q-item-label>
          </div>
          <div class="row">
            <q-icon name="phone"/>
            <q-item-label class="q-pl-sm">+918754694995</q-item-label>
          </div>
          <div class="q-pt-sm row">
            <q-icon name="email"/>
            <q-item-label class="q-pl-sm">greenudt@gmail.com</q-item-label>
          </div>
      </q-card-section>
  
    </q-card>
</template>

<script>
export default {

}
</script>

<style>
.AClass{
    right:0px;
    position: absolute;
}
</style>