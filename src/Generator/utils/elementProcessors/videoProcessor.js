export const processVideoElement = (node, elementId) => {
  const videoSrc = node.querySelector('source')?.getAttribute('src') || node.getAttribute('src') || '';
  const posterSrc = node.getAttribute('poster') || '';

  const element = {
    id: elementId,
    name: 'video',
    parent: '0',
    children: [],
    settings: {
      videoType: 'file',
      youTubeId: '',
      youtubeControls: true,
      vimeoByline: true,
      vimeoTitle: true,
      vimeoPortrait: true,
      fileControls: node.hasAttribute('controls'),
      fileUrl: videoSrc,
      fileAutoplay: node.hasAttribute('autoplay'),
      fileLoop: node.hasAttribute('loop'),
      fileMute: node.hasAttribute('muted'),
      fileInline: node.hasAttribute('playsinline'),
      filePreload: node.getAttribute('preload') || 'auto',
      ...(posterSrc && {
        videoPoster: {
          url: posterSrc,
          external: true,
          filename: posterSrc.split('/').pop() || 'poster.jpg'
        }
      })
    },
    label: 'Video'
  };

  // Handle width/height as inline styles
  if (node.hasAttribute('width') || node.hasAttribute('height')) {
    element.settings.style = [
      node.getAttribute('width') ? `width: ${node.getAttribute('width')}px` : '',
      node.getAttribute('height') ? `height: ${node.getAttribute('height')}px` : ''
    ].filter(Boolean).join('; ');
  }

  return element;
};

export default processVideoElement;
