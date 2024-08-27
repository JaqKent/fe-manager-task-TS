interface SpeechRecognitionResult {
  transcript: string;
}

interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionUtils {
  startRecognition: () => void;
  stopRecognition: () => void;
  onResult: (callback: (transcript: string) => void) => void;
  onError: (callback: (error: string) => void) => void;
}

export function createSpeechRecognitionUtils(): SpeechRecognitionUtils {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('SpeechRecognition API no es compatible con este navegador.');
    return {
      startRecognition: () => {},
      stopRecognition: () => {},
      onResult: () => {},
      onError: () => {},
    };
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'es-ES';

  let resultCallback = (transcript: string) => {};
  let errorCallback = (error: string) => {};

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript =
      event.results[event.results.length - 1][0].transcript.trim();
    resultCallback(transcript);
  };

  recognition.onerror = (event) => {
    errorCallback(event.error);
  };

  return {
    startRecognition: () => recognition.start(),
    stopRecognition: () => recognition.stop(),
    onResult: (callback: (transcript: string) => void) => {
      resultCallback = callback;
    },
    onError: (callback: (error: string) => void) => {
      errorCallback = callback;
    },
  };
}
