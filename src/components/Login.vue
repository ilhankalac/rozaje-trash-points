<template>
    <div class="login-page">
        <v-card class="login-container" elevation="0">
            <div class="login-logo">
                <v-icon size="34" color="white">mdi-map-marker-radius</v-icon>
            </div>
            <h2 class="login-title">Dobrodošli nazad</h2>
            <p class="login-subtitle">Prijavite se da upravljate deponijama</p>

            <v-text-field
                v-model="email"
                label="Email"
                type="email"
                outlined
                dense
                rounded
                prepend-inner-icon="mdi-email-outline"
                class="mt-2"
                @keyup.enter="login"
            ></v-text-field>
            <v-text-field
                v-model="password"
                label="Lozinka"
                type="password"
                outlined
                dense
                rounded
                prepend-inner-icon="mdi-lock-outline"
                @keyup.enter="login"
            ></v-text-field>

            <v-alert v-if="error" type="error" dense text class="text-left login-error">
                {{ error }}
            </v-alert>

            <v-btn color="primary" depressed rounded block large class="text-none font-weight-medium mt-1" @click="login">
                Prijavi se
                <v-icon right small>mdi-login</v-icon>
            </v-btn>
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

<style scoped>
.login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 64px);
    padding: 24px;
}
.login-container {
    width: 100%;
    max-width: 420px;
    padding: 36px 32px 32px;
    border-radius: 22px !important;
    text-align: center;
    background: rgba(18, 32, 25, 0.9) !important;
    backdrop-filter: saturate(160%) blur(14px);
    -webkit-backdrop-filter: saturate(160%) blur(14px);
    border: 1px solid var(--line, rgba(255, 255, 255, 0.08));
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5) !important;
}
.login-logo {
    width: 68px;
    height: 68px;
    margin: 0 auto 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background: linear-gradient(135deg, #93C34D, #1C4A36);
    box-shadow: 0 12px 28px rgba(147, 195, 77, 0.4);
}
.login-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--ink, #f8fafc);
    margin-bottom: 4px;
}
.login-subtitle {
    font-size: 0.85rem;
    color: var(--ink-soft, #94a3b8);
    margin-bottom: 22px;
}
.login-error {
    border-radius: 12px !important;
}
</style>