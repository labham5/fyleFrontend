<template>
  <div id="app" class="light">
    <router-view @change="changeTheme()"/>
  </div>
</template>


<script>
export default {

   methods:{
    changeTheme(){
      this.trans();
      const bodyClass = document.getElementById('app').classList;
      const current = localStorage.getItem('theme');
      let next;
      if(current == 'light')
      {
        next='dark'
      }
      else
      {
        next='light'
      }
      bodyClass.replace(current, next);
      localStorage.setItem('theme', next);
    },
    trans() {
        document.documentElement.classList.add('transition');
        window.setTimeout(() => {
            document.documentElement.classList.remove('transition')
        }, 500)
    }
  },
  mounted()
     {
        const bodyClass = document.getElementById('app').classList;
        const current = localStorage.getItem('theme');
        if(current != 'light')
        {
          bodyClass.replace('light',current)
        }
     },
}
</script>

<style>
:root{
  --bg: #FCFCFC;
  --bg-panel: #EBEBEB;
  --color-headings: #ff8533;
  --color-text: #333333;
  --inverse: #333333;
}

.dark {
  --bg: #333333;
  --bg-panel: #434343;
  --color-headings: #ff8533;
  --color-text: #B5B5B5;
  --inverse: #FCFCFC;
}
.white {
  --bg: #FCFCFC;
  --bg-panel: #EBEBEB;
  --color-headings: #3694FF;
  --color-text: #333333;
  --inverse: #020202;
}
html.transition,
html.transition *,
html.transition *:before,
html.transition *:after {
  transition: all 750ms !important;
  transition-delay: 0 !important;
}
</style>
