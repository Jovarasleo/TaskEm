import { MouseEvent } from "react";

const autoScroll = (
  scrollContainer: HTMLUListElement | null,
  scrollToBottom: boolean,
  e: MouseEvent<HTMLElement>
) => {
  const easeInOutQuad = (x: number) => {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };

  const containerRect = scrollContainer?.getBoundingClientRect();
  const distanceThreshold = containerRect ? containerRect?.height / 4 : 250;

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

  const acceleration = Math.pow(scrollSpeed, 3) * 1000;
  const scrollStep = acceleration > 5 ? acceleration : 5;

  if (scrollContainer && scrollDistanceFromTop < distanceThreshold) {
    scrollContainer.scrollTop -= scrollStep;
  }

  if (scrollContainer && scrollDistanceFromBottom < distanceThreshold) {
    scrollContainer.scrollTop += scrollStep;
  }

  if (scrollToBottom && scrollContainer) {
    const interval = setTimeout(() => {
      scrollContainer.scrollTop += scrollStep;
      clearInterval(interval);
    }, 50);
  }
};
export default autoScroll;
