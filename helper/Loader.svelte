<script>
    export let size = 100;
    export let msg = false;
</script>

<div class="loader" style="height:{size}px; width: {size}px"></div>
{#if msg}
  <div class="loader_msg">{msg}</div>
{/if}
<style>
.loader {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #3498db;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  margin: 0 auto;
}

.loader_msg {
  text-align: center;
  padding: 15px;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>