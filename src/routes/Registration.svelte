<script>
    import { loadFromLocalStorage, saveToLocalStorage } from '$lib/localStorage.js';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    let inputUsername = '';

    function handleRegistration() {
        saveToLocalStorage('lgk-roulette-username', inputUsername);
        dispatch('registered', { username: inputUsername });
    }

</script>

<div class="registration">
    <input type="text" bind:value={inputUsername} placeholder="Enter your name" />
    <button on:click={handleRegistration} disabled={!inputUsername}>Register</button>

</div>

