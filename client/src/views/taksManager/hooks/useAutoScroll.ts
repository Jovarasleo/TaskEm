import { DragEvent } from "react";

const useAutoScroll = (
  scrollContainer: HTMLUListElement | null,
  e: DragEvent<HTMLElement>
) => {
  const easeInOutQuad = (x: number) => {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };

  const containerRect = scrollContainer?.getBoundingClientRect();
  const distanceThreshold = 250;

  const containerTop = containerRect?.top || 0;
  const containerBottom = containerRect?.bottom || 0;

  const scrollDistanceFromTop = e.clientY - containerTop;
  const scrollDistanceFromBottom = containerBottom - e.clientY;
  const distanceRatio = Math.min(
    1,
    Math.max(
      0,
      (distanceThreshold -
        Math.min(scrollDistanceFromTop, scrollDistanceFromBottom)) /
        distanceThreshold
    )
  );

  const scrollSpeed = easeInOutQuad(distanceRatio);

  const acceleration = Math.pow(scrollSpeed, 3) * 150;
  const scrollStep = acceleration > 5 ? acceleration : 5;

  if (scrollContainer && scrollDistanceFromTop < distanceThreshold) {
    scrollContainer.scrollTop -= scrollStep;
  }

  if (scrollContainer && scrollDistanceFromBottom < distanceThreshold) {
    scrollContainer.scrollTop += scrollStep;
  }
};
export default useAutoScroll;
