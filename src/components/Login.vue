<template>
    <div>
        <v-card class="login-container">
            <v-text-field 
                v-model="username" 
                clearable
                label="Korisničko ime" 
            ></v-text-field>
            <v-text-field 
                v-model="password" 
                clearable
                label="Lozinka"
                type="password"
            ></v-text-field>
            <v-btn color="pink" @click="login">Prijavi se <v-icon>mdi-login</v-icon></v-btn>

        </v-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
            username: '',
            password: ''
        }
    },
    methods:{
        login(){
            
        }
    }

}
</script>

<style>
.login-container{
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    min-width: 300px;
    padding: 20px;
}

</style>