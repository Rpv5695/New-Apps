
export enum ErrorType {
  CASING = 'casing',
  GRAMMAR = 'grammar',
  PUNCTUATION = 'punctuation',
  SPELLING = 'spelling'
}

export interface Correction {
  originalPart: string;
  replacementPart: string;
  type: ErrorType;
  explanation: string;
  startIndex: number;
  endIndex: number;
}

export interface AnalysisResult {
  correctedText: string;
  corrections: Correction[];
  refinedVersions: {
    professional: string;
    concise: string;
    creative: string;
  };
  isClean: boolean;
}
