export function autoplayWhenVisible(node: HTMLVideoElement) {
  let isVisible = false;

  const updatePlayback = () => {
    if (isVisible && !document.hidden) {
      node.muted = true;
      void node.play().catch(() => {
        // Some browsers may still require a user gesture; controls remain available.
      });
    } else {
      node.pause();
    }
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      updatePlayback();
    },
    { threshold: [0, 0.5, 1] }
  );

  const handleVisibilityChange = () => updatePlayback();

  observer.observe(node);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return {
    destroy() {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      node.pause();
    }
  };
}
