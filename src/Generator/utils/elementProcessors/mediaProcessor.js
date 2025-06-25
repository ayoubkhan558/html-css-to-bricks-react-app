import { getUniqueId } from '../utils';
import { processVideoElement } from './videoProcessor';

const processImage = (node, elementId) => {
  return {
    id: elementId,
    name: 'image',
    parent: '0',
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
};

const processVideo = (node, elementId) => {
  const videoSrc = node.querySelector('source')?.getAttribute('src') || node.getAttribute('src') || '';
  const posterSrc = node.getAttribute('poster') || '';

  return {
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
    }
  };
};

const processAudio = (node, elementId) => {
  return {
    id: elementId,
    name: 'audio',
    parent: '0',
    children: [],
    settings: {
      source: 'external',
      external: node.querySelector('source')?.getAttribute('src') || node.getAttribute('src') || '',
      loop: node.hasAttribute('loop'),
      autoplay: node.hasAttribute('autoplay')
    }
  };
};

const processSvg = (node, elementId) => {
  return {
    id: elementId,
    name: 'code',
    parent: '0',
    children: [],
    settings: {
      source: 'code',
      code: node.outerHTML
    }
  };
};

export { processImage, processVideo, processAudio, processSvg, processVideoElement };
