export const state = {
    isPlaying: false,
    bpm: 120,
    pausedBeat: 0,
    startTime: 0,
    msPerBeat: 60000 / 120,  // 60000 / bpm の初期値
}