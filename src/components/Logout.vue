<template>
    <q-card class="constrain-more">
        <q-card-section>
            <q-chip square size="18px" color="blue-grey-2" text-color="black" icon="login">
                Logged as {{showLoginName}}
            </q-chip>
        </q-card-section>
        <q-card-section class="row justify center">
            <q-btn rounded icon="logout" color="primary" label="Logout" @click="onLogout"/>
        </q-card-section>
    </q-card>
</template>

<script>
export default {
computed: {
    showLoginName(){
        if (this.$store.state.selectedProvider)
            return this.$store.state.selectedProvider.name
        else
            return this.$store.state.selectedUser.name

    }
},
methods: {
    onLogout(){
        if (this.$store.state.selectedProvider)
            this.$store.commit('setSelectedProvider',null)
        else
            this.$store.commit('setSelectedUser',null)
        this.$store.commit('setLoginStatus',false)
    }
}

}
</script>

<style>

</style>