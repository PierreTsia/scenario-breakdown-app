<template>
  <v-app-bar id="core-toolbar" absolute color="primary" dark>
    <div class="v-toolbar-title">
      <v-toolbar-title class="font-weight-light text-general">
        <v-btn
          class="default v-btn--simple"
          icon
          @click.stop="onDrawerIconClick"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-toolbar-title>
    </div>

    <v-spacer />
    <v-toolbar-items class="py-4">
      <v-badge color="error" overlap>
        <template slot="badge">{{ notifications.length }}</template>
        <v-icon>mdi-bell</v-icon>
      </v-badge>
    </v-toolbar-items>
  </v-app-bar>
</template>
<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
@Component({})
export default class Toolbar extends Vue {
  readonly notifications: string[] = [
    "Mike, Thanos is coming",
    "5 new avengers joined the team",
    "You're now friends with Capt",
    "Another Notification",
    "Another One - Dj Khalid voice"
  ];
  title = "Scenario Breakdown";
  responsive = false;
  responsiveInput = false;

  @Emit()
  onDrawerIconClick() {
    console.log("pouet");
    return true;
  }

  onClick() {
    console.log("onClick");
  }
  logout() {
    console.log("logout");
  }

  /*
  *
  *   computed: {
    ...mapGetters(['authorized'])
  },

  watch: {
    $route (val) {
      this.title = val.meta.name
    }
  },

  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },

  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onClickBtn () {
      this.setDrawer(!this.$store.state.app.drawer)
    },
    onClick () {
      //
    },
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
        this.responsiveInput = false
      } else {
        this.responsive = false
        this.responsiveInput = true
      }
    },
    logout: function () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/')
      })
    }
  *
  * */
}
</script>
