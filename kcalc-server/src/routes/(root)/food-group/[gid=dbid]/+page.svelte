<script lang="ts">
import type { PageData } from './$types'

export let data: PageData

console.log(`Page Data Infood group:`, data.foods)
</script>

<h2>{data.group?.name}</h2>
<ul>
  {#each data.foods as food (food.id)}
    <li>
      {food.name}
    </li>
  {:else}
    <li>No Foods For Group</li>
  {/each}
</ul>
