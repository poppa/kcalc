<script lang="ts">
import { page } from '$app/stores'
import type { PlainObject } from '@poppanator/kcalc-lib'
import type { Group } from '@poppanator/kcalc-lib/dist/src/db'
import type { LayoutData } from './$types'

export let data: LayoutData

const getFirstChar = (s: string): string => {
  return s[0].toUpperCase()
}

const groups: PlainObject<Group[]> = {}

for (const g of data.groups) {
  const fc = getFirstChar(g.name)
  const t = groups[fc] ?? (groups[fc] = [])
  t.push(g)
}
</script>

<header>
  <h1>
    <a href="/">Kcalc</a>
    <span>Calorie Calculator and Stuff</span>
  </h1>
</header>

<main>
  <aside>
    <h2>Food Groups</h2>

    {#each Object.entries(groups) as [char, g]}
      <section>
        <header>{char}</header>
        <ul>
          {#each g as group (group.id)}
            <li class:selected={group.id === $page.params.gid}>
              <a href="/food-group/{group.id}">
                {group.name}
              </a>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </aside>

  <div class="contents">
    <slot />
  </div>
</main>

<footer>Kcalc v.xxx</footer>

<style lang="scss">
main {
  display: grid;
  grid-template-columns: 0.25fr 1fr;
  gap: 1em;
}

section {
  header {
    background-color: lightgray;
    font-weight: bold;
  }
}

li {
  &.selected {
    font-weight: bold;
  }
}
</style>
