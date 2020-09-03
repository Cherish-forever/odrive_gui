<template>
  <div class="wizard">
    <div class="wizard-container">
      <div class="wizard-page">
        <!-- show the appropriate component -->
        <component v-bind:is="currentPage"></component>
      </div>
      <div class="wizard-controls">
        <!-- show breadcrumbs, back, apply, next buttons -->
        <button class="back-btn" @click="back">BACK</button>
        <button class="apply-btn" @click="apply">APPLY</button>
        <button class="next-btn" @click="next">NEXT</button>
      </div>
    </div>
  </div>
</template>

<script>
import wizardODrive from "../components/wizard/wizardODrive.vue";
import wizardAxis from "../components/wizard/wizardAxis.vue";
import wizardMotor from "../components/wizard/wizardMotor.vue";
import wizardEncoder from "../components/wizard/wizardEncoder.vue";
import wizardLimits from "../components/wizard/wizardLimits.vue";

let wizard_states = {
  PICK_ODRIVE: {
    val: 0,
    page: "wizardODrive"
  },
  PICK_AXIS: {
    val: 1,
    page: "wizardAxis",
  },
  MOTOR_0: {
    val: 2,
    page: "wizardMotor",
  },
  ENCODER_0: {
    val: 3,
    page: "wizardEncoder",
  },
  MOTOR_1: {
    val: 4,
    page: "wizardMotor",
  },
  ENCODER_1: {
    val: 5,
    page: "wizardEncoder",
  },
  LIMITS_0: {
    val: 6,
    page: "wizardLimits",
  },
  LIMITS_1: {
    val: 7,
    page: "wizardLimits",
  },
};

export default {
  name: "Wizard",
  components: {
    wizardODrive,
    wizardAxis,
    wizardMotor,
    wizardEncoder,
    wizardLimits,
  },
  props: [],
  data: function () {
    return {
      currentStep: wizard_states.PICK_ODRIVE,
    };
  },
  computed: {
    currentPage() {
      return this.currentStep.page;
    },
  },
  methods: {
    next() {
      // go to the next page
      let state = this.currentStep;
      switch (this.currentStep) {
        case wizard_states.PICK_ODRIVE:
          this.currentStep = wizard_states.PICK_AXIS;
          break;
        case wizard_states.PICK_AXIS:
          this.currentStep = wizard_states.MOTOR_0;
          break;
        case wizard_states.MOTOR_0:
          this.currentStep = wizard_states.ENCODER_0;
          break;
        case wizard_states.ENCODER_0:
          this.currentStep = wizard_states.LIMITS_0;
          break;
        case wizard_states.LIMITS_0:
          break;
        default:
          break;
      }
      console.log("Going from " + state.val + " to " + this.currentStep.val);
    },
    apply() {
      // apply settings to odrive
      console.log("applying config");
    },
    back() {
      //go to the previous page
      let state = this.currentStep;
      switch (this.currentStep) {
        case wizard_states.PICK_ODRIVE:
          break;
        case wizard_states.PICK_AXIS:
          this.currentStep = wizard_states.PICK_ODRIVE;
          break;
        case wizard_states.MOTOR_0:
          this.currentStep = wizard_states.PICK_AXIS;
          break;
        case wizard_states.ENCODER_0:
          this.currentStep = wizard_states.MOTOR_0;
          break;
        case wizard_states.LIMITS_0:
          this.currentStep = wizard_states.ENCODER_0;
          break;
        default:
          break;
      }
      console.log("Going from " + state.val + " to " + this.currentStep.val);
    },
  },
};
</script>

<style scoped>
.wizard {
  background-color: var(--bg-color);
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  padding-top: var(--top-height);
  padding-bottom: var(--bottom-height);
}

.wizard-container {
  display: flex;
  flex-direction: column;
  height: 95vh;
}
</style>