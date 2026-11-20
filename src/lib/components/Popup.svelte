<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    type Type = "default" | "success" | "failed";
    export let type: Type = "default";
    export let message: string = "no text provided";
    export let duration: number = 4000;

    let visible = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const colours: Record<Type, string> = {
        default: "#F5F5F5",
        success: "#55FF55",
        failed: "#ff5555",
    };

    $: styles = `background-color: ${colours[type] || colours.default}`;

    onMount(() => {
        timer = setTimeout(() => {
            visible = false;
        }, duration);
    });

    onDestroy(() => {
        if (timer) clearTimeout(timer);
    });
</script>

{#if visible}
    <div id="wrapper">
        <div id="msg">
            <p style={styles}>{message}</p>
        </div>
    </div>
{/if}

<style lang="scss">
    #wrapper {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        pointer-events: none;

        #msg {
            display: flex;
            justify-content: center;
            margin-top: 85vh;

            p {
                display: block;
                padding: 1.2rem 3rem;
                font-size: 1.5rem;
                font-weight: 600;
                text-align: center;
                border-radius: 12px;
                color: #0b1424;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                animation: 0.4s fadeIn ease-in-out;
            }
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(2rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
