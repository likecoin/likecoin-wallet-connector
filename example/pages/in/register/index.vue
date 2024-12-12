<script>
export default {
  fetch({ redirect, query }) {
    const { code, method, page = '/' } = query;
    redirect(`${page}?code=${code}&method=${method}`)
  }
}
</script>