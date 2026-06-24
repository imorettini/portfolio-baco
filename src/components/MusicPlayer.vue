<template>
    <div class="flex flex-col h-full text-black select-none font-mono text-sm bg-[#c0c0c0]">
      <div class="bg-[#0f172a] p-3 m-2 rounded shadow-[inset_2px_2px_0px_rgba(0,0,0,1)] border border-white/10 text-[#00ff00] flex flex-col gap-2">
        
        <div class="flex justify-between items-center bg-black/40 p-2 rounded border border-green-900/30">
          <div class="truncate w-2/3">
            <span class="text-xs text-green-700 block uppercase tracking-wider text-[10px]">Música Atual</span>
            <div class="animate-pulse truncate font-bold text-base">
              {{ currentTrack.title }}
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs text-green-700 block uppercase tracking-wider text-[10px]">Tempo</span>
            <div class="text-xl font-bold font-mono tracking-widest text-orange-400">
              {{ formatTime(currentTime) }}
            </div>
          </div>
        </div>
  
        <div class="flex items-center gap-2 mt-1">
          <span class="text-[10px] text-green-700">00:00</span>
          <input 
            type="range" 
            min="0" 
            :max="duration || 100" 
            :value="currentTime"
            @input="onSeek"
            class="w-full accent-[#00ff00] bg-zinc-800 h-2 rounded cursor-pointer appearance-none"
          />
          <span class="text-[10px] text-green-700">{{ formatTime(duration) }}</span>
        </div>
      </div>
  
      <div class="grid grid-cols-4 gap-2 px-2 pb-2">
        <button 
          @click="togglePlay" 
          class="active:shadow-[inset_2px_2px_0px_rgba(0,0,0,1)] shadow-[2px_2px_0px_rgba(0,0,0,1),_inset_-1px_-1px_0px_rgba(0,0,0,0.5)] border-t border-l border-white bg-[#c0c0c0] py-1 font-bold text-center hover:bg-[#d4d4d4]"
          :class="{ 'bg-zinc-400 shadow-[inset_1px_1px_0px_rgba(0,0,0,1)]': isPlaying }"
        >
          {{ isPlaying ? 'PAUSE' : 'PLAY' }}
        </button>
        
        <button 
          @click="stopTrack" 
          class="active:shadow-[inset_2px_2px_0px_rgba(0,0,0,1)] shadow-[2px_2px_0px_rgba(0,0,0,1),_inset_-1px_-1px_0px_rgba(0,0,0,0.5)] border-t border-l border-white bg-[#c0c0c0] py-1 font-bold text-center hover:bg-[#d4d4d4]"
        >
          STOP
        </button>
  
        <button 
          @click="nextTrack" 
          class="active:shadow-[inset_2px_2px_0px_rgba(0,0,0,1)] shadow-[2px_2px_0px_rgba(0,0,0,1),_inset_-1px_-1px_0px_rgba(0,0,0,0.5)] border-t border-l border-white bg-[#c0c0c0] py-1 font-bold text-center hover:bg-[#d4d4d4]"
        >
          NEXT
        </button>
  
        <button 
          @click="toggleMute" 
          class="active:shadow-[inset_2px_2px_0px_rgba(0,0,0,1)] shadow-[2px_2px_0px_rgba(0,0,0,1),_inset_-1px_-1px_0px_rgba(0,0,0,0.5)] border-t border-l border-white bg-[#c0c0c0] py-1 font-bold text-center hover:bg-[#d4d4d4]"
          :class="{ 'bg-red-200': isMuted }"
        >
          {{ isMuted ? 'UNMUTE' : 'MUTE' }}
        </button>
      </div>
  
      <div class="flex-1 p-2 m-2 mt-0 bg-white border border-gray-400 shadow-[inset_1px_1px_0px_rgba(0,0,0,1)] overflow-y-auto max-h-[140px]">
        <div class="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1 border-b pb-1 border-dotted border-gray-300">
          Winamp Playlist
        </div>
        <ul>
          <li 
            v-for="(track, index) in playlist" 
            :key="index"
            @click="selectTrack(index)"
            class="cursor-pointer px-1 py-0.5 text-xs truncate rounded flex justify-between items-center"
            :class="currentTrackIndex === index ? 'bg-[#000080] text-white' : 'text-black hover:bg-gray-200'"
          >
            <span>{{ index + 1 }}. {{ track.title }}</span>
            <span class="text-[10px] opacity-60">{{ track.genre }}</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
  
  const playlist = ref([
    {
      title: "Chiptune Journey (8-Bit)",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      genre: "8-BIT"
    },
    {
      title: "Retro Cyber Dreams",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      genre: "SYNTH"
    },
    {
      title: "Windows 95 Lo-Fi Anthems",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      genre: "LO-FI"
    }
  ]);
  
  const currentTrackIndex = ref(0);
  const isPlaying = ref(false);
  const isMuted = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  
  let audio = null;
  
  const currentTrack = computed(() => playlist.value[currentTrackIndex.value]);
  
  // Inicializar Áudio de forma segura
  onMounted(() => {
    initAudio();
  });
  
  onBeforeUnmount(() => {
    if (audio) {
      audio.pause();
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', nextTrack);
    }
  });
  
  const initAudio = () => {
    if (audio) {
      audio.pause();
    }
    
    audio = new Audio(currentTrack.value.url);
    audio.muted = isMuted.value;
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', nextTrack);
  
    if (isPlaying.value) {
      audio.play().catch(() => {
        isPlaying.value = false; // Previne o erro de autoplay bloqueado pelo navegador
      });
    }
  };
  
  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying.value) {
      audio.pause();
      isPlaying.value = false;
    } else {
      audio.play().then(() => {
        isPlaying.value = true;
      }).catch(err => console.log("Interação prévia do usuário necessária:", err));
    }
  };
  
  const stopTrack = () => {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    isPlaying.value = false;
    currentTime.value = 0;
  };
  
  const nextTrack = () => {
    currentTrackIndex.value = (currentTrackIndex.value + 1) % playlist.value.length;
    initAudio();
  };
  
  const selectTrack = (index) => {
    currentTrackIndex.value = index;
    isPlaying.value = true; 
    initAudio();
  };
  
  const toggleMute = () => {
    if (!audio) return;
    isMuted.value = !isMuted.value;
    audio.muted = isMuted.value;
  };
  
  const updateProgress = () => {
    if (audio) currentTime.value = audio.currentTime;
  };
  
  const updateDuration = () => {
    if (audio) duration.value = audio.duration;
  };
  
  const onSeek = (e) => {
    if (!audio) return;
    const targetTime = parseFloat(e.target.value);
    audio.currentTime = targetTime;
    currentTime.value = targetTime;
  };
  
  // Formatador de tempo MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  </script>
  
  <style scoped>
  input[type="range"]::-webkit-slider-thumb {
    background: #c0c0c0;
    border: 2px solid #fff;
    border-right-color: #7f7f7f;
    border-bottom-color: #7f7f7f;
    width: 10px;
    height: 16px;
    cursor: pointer;
    appearance: none;
    box-shadow: 1px 1px 1px #000;
  }
  </style>