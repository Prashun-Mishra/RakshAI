interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  start(): void;
}
interface SpeechRecognitionEvent extends Event { results: SpeechRecognitionResultList; }
interface Window { SpeechRecognition?: { new (): SpeechRecognition }; webkitSpeechRecognition?: { new (): SpeechRecognition }; }
