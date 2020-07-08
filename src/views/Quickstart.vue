<template>
    <div class="quickstart">
        <div class="card_holder">
            <div class="card">Quickstart Content</div>
            <div class="card">
                <a target="_blank" href="https://docs.odriverobotics.com/" >Getting Started</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Quickstart'
}
</script>

<style>
.quickstart {
    padding: 48px 0;
    display: flex;
    flex-direction: row;
    background-color: var(--bg-color);
    height: 100vh;
}

.card_holder {
    flex-direction: column;
}

.card {
    padding: 10px;
    margin: 10px;
    background-color: #fff;
    text-align: center;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
}

</style>