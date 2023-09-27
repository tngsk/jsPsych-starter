// jsPsych Example
// https://www.jspsych.org/7.3/tutorials/rt-task/

import { initJsPsych } from "jspsych";
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import imageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';
import preload from "@jspsych/plugin-preload";

const jsPsych = initJsPsych({
    on_finish: () => {
        jsPsych.data.displayData()
    }
})

let timeline = []

const preloading = {
    type: preload,
    images: ['stimulus_assets/blue.png', 'stimulus_assets/orange.png']
}
timeline.push(preloading)

const welcome = {
    type: htmlKeyboardResponse,
    stimulus: "Welcome to the expriment. Press any key to begin."
}
timeline.push(welcome)

const stimuli = [
    { stimulus: "stimulus_assets/blue.png", correct_response: 'f' },
    { stimulus: "stimulus_assets/orange.png", correct_response: 'j' }
]

const fixation = {
    type: htmlKeyboardResponse,
    stimulus: '<div class="fixation">+</div>',
    choices: "NO_KEYS",
    trial_duration: () => {
        return jsPsych.randomization.sampleWithoutReplacement(
            [250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
    },
    data: {
        task: 'fixation'
    }
}

const trial = {
    type: imageKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ['f', 'j'],
    data: {
        task: 'response',
        correct_response: jsPsych.timelineVariable('correct_response')
    },
    on_finish: (data:any) => {
        data.correct = jsPsych.pluginAPI.compareKeys(
            data.response,
            data.correct_response
        )
    }
}

const trial_procedure = {
    timeline: [fixation, trial],
    timeline_variables: stimuli,
    repetitions: 5,
    randomize_order: true
}
timeline.push(trial_procedure)

const debriefing = {
    type: htmlKeyboardResponse,
    stimulus: () => {
        const trials = jsPsych.data.get().filter({ task: 'response' })
        const correct_trials = trials.filter({ correct: true })
        const accuracy = Math.round(correct_trials.count() / trials.count() * 100)
        const rt = Math.round(correct_trials.select('rt').mean())
        return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time was ${rt}ms.</p>
          <p>Press any key to complete the experiment. Thank you!</p>`;
    }
}
timeline.push(debriefing)

// Run!
jsPsych.run(timeline);
