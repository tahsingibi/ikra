"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getSurah } from "@/data/surahs";
import { verseAudioUrl } from "@/services/audio";
import { useOnline } from "@/hooks/use-online";
import { useSettings } from "@/hooks/use-settings";

type AudioContextValue = {
  surah?: number;
  ayah?: number;
  playing: boolean;
  loading: boolean;
  error: string | null;
  progress: number;
  duration: number;
  playVerse: (surah: number, ayah: number) => void;
  toggle: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (ratio: number) => void;
  replaySurah: () => void;
  close: () => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const online = useOnline();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [surah, setSurah] = useState<number>();
  const [ayah, setAyah] = useState<number>();
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;
    const onTime = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = settings.playbackRate;
    audio.volume = settings.volume;
  }, [settings.playbackRate, settings.volume]);

  const loadAndPlay = useCallback(
    async (nextSurah: number, nextAyah: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (!online) {
        setError("Ses için internet bağlantısı gerekiyor.");
        setPlaying(false);
        return;
      }
      setError(null);
      setLoading(true);
      setSurah(nextSurah);
      setAyah(nextAyah);
      audio.src = verseAudioUrl(settings.reciterId, nextSurah, nextAyah);
      try {
        await audio.play();
      } catch {
        setError("Ses yüklenemedi. İnternet bağlantısını kontrol edin.");
        setPlaying(false);
      } finally {
        setLoading(false);
      }
    },
    [online, settings.reciterId],
  );

  const next = useCallback(() => {
    if (!surah || !ayah) return;
    const meta = getSurah(surah);
    if (!meta) return;
    if (ayah < meta.ayahCount) {
      void loadAndPlay(surah, ayah + 1);
      return;
    }
    if (settings.repeatMode === "surah") {
      void loadAndPlay(surah, 1);
      return;
    }
    if (settings.autoplayNext && surah < 114) {
      void loadAndPlay(surah + 1, 1);
    }
  }, [ayah, loadAndPlay, settings.autoplayNext, settings.repeatMode, surah]);

  const previous = useCallback(() => {
    if (!surah || !ayah) return;
    if (ayah > 1) {
      void loadAndPlay(surah, ayah - 1);
      return;
    }
    if (surah > 1) {
      const prev = getSurah(surah - 1);
      if (prev) void loadAndPlay(prev.number, prev.ayahCount);
    }
  }, [ayah, loadAndPlay, surah]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      if (settings.repeatMode === "verse" && surah && ayah) {
        void loadAndPlay(surah, ayah);
        return;
      }
      next();
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [ayah, loadAndPlay, next, settings.repeatMode, surah]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      return;
    }
    if (surah && ayah) {
      void audio.play().catch(() => setError("Ses için internet bağlantısı gerekiyor."));
      return;
    }
    void loadAndPlay(1, 1);
  }, [ayah, loadAndPlay, playing, surah]);

  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = audio.duration * ratio;
  }, []);

  const replaySurah = useCallback(() => {
    if (surah) void loadAndPlay(surah, 1);
  }, [loadAndPlay, surah]);

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setPlaying(false);
    setLoading(false);
    setError(null);
    setProgress(0);
    setDuration(0);
    setSurah(undefined);
    setAyah(undefined);
  }, []);

  const value = useMemo(
    () => ({
      surah,
      ayah,
      playing,
      loading,
      error,
      progress,
      duration,
      playVerse: loadAndPlay,
      toggle,
      pause,
      next,
      previous,
      seek,
      replaySurah,
      close,
    }),
    [
      ayah,
      close,
      duration,
      error,
      loadAndPlay,
      loading,
      next,
      pause,
      playing,
      previous,
      progress,
      replaySurah,
      seek,
      surah,
      toggle,
    ],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const context = useContext(AudioCtx);
  if (!context) throw new Error("useAudio AudioProvider dışında kullanıldı.");
  return context;
}
