import { getUniqueId } from '../utils';

export const processImageElement = (node) => {
  const elementId = getUniqueId();
  
  const element = {
    id: elementId,
    name: 'image',
    parent: 0,
    children: [],
    settings: {
      src: node.getAttribute('src') || '',
      alt: node.getAttribute('alt') || '',
      image: {
        url: node.getAttribute('src') || '',
        external: true,
        filename: (node.getAttribute('src') || 'image.jpg').split('/').pop()
      },
      _attributes: [{
        id: getUniqueId(),
        name: 'loading',
        value: 'lazy'
      }]
    }
  };

  return element;
};

export const processVideoElement = (node) => {
  const elementId = getUniqueId();
  const videoSrc = node.querySelector('source')?.getAttribute('src') || node.getAttribute('src') || '';
  const posterSrc = node.getAttribute('poster') || '';

  const element = {
    id: elementId,
    name: 'video',
    parent: 0,
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
    }
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

export const processAudioElement = (node) => {
  const elementId = getUniqueId();
  
  const element = {
    id: elementId,
    name: 'audio',
    parent: 0,
    children: [],
    settings: {
      source: 'external',
      external: node.querySelector('source')?.getAttribute('src') || node.getAttribute('src') || '',
      loop: node.hasAttribute('loop'),
      autoplay: node.hasAttribute('autoplay')
    }
  };

  return element;
};

export const processSvgElement = (node) => {
  const elementId = getUniqueId();
  
  const element = {
    id: elementId,
    name: 'svg',
    parent: 0,
    children: [],
    settings: {
      source: 'code',
      code: node.outerHTML
    }
  };

  return element;
};
