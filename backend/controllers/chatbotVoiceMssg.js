/*const DeepSpeech = require('deepspeech');
const fs = require('fs');

// Load the pre-trained model
const modelFile = 'D:/DeepSpeech/deepspeech-0.9.3-models.pbmm';
const scorerFile = 'D:/DeepSpeech/deepspeech-0.9.3-models.scorer';
const model = new DeepSpeech.Model(modelFile);
model.enableExternalScorer(scorerFile);

async function transcribeAudio(audioFile) {
  // Prepare the audio file
  const audioContent = fs.readFileSync(audioFile);

  // Prepare the input stream
  const stream = model.createStream();
  const frames = Math.ceil(audioContent.length / model.bytesPerFrame());
  for (let i = 0; i < frames; i++) {
    const data = audioContent.slice(i * model.bytesPerFrame(), (i + 1) * model.bytesPerFrame());
    stream.feedAudioContent(data);
  }

  // Finish the stream and get the result
  stream.finishAudioContent();
  const result = await new Promise((resolve) => {
    stream.on('transcriptionComplete', (result) => resolve(result));
  });

  return result.hypotheses[0].transcript;
}*/