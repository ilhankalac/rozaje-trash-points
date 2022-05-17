<template>
    <div>
        <v-card class="login-container">
            <v-text-field 
                v-model="email" 
                label="Email" 
                @keyup.enter="login"
            ></v-text-field>
            <v-text-field 
                v-model="password" 
                label="Lozinka"
                type="password"
                @keyup.enter="login"
            ></v-text-field>
            <p v-if="error" style="color:red">{{error}}</p>
            <v-btn color="pink" @click="login" > Prijavi se<v-icon>mdi-login</v-icon></v-btn>
        </v-card>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    data(){
        return {
            email: '',
            password: '',
            error: null
        }
    },
    methods:{
        login(){
             firebase
                .auth()
                .signInWithEmailAndPassword(this.email, this.password)
                .then(data => {
                    this.$store.state.user = data.user;
                    this.error = null;
                    this.$router.push({ name: "Home" });
                })
                .catch(err => {
                    this.error = err.message;
                });
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
    min-width: 500px;
    padding: 20px;
}

</style>