import '@globalPublish/pc/js/lib/load-image.all-5.14.0.min.js'

type loadImageCallback = (image: HTMLCanvasElement | HTMLImageElement, data?: Object) => void;

export default loadImage as (file: File|Blob|string, callback: loadImageCallback, options: Object) => HTMLImageElement|FileReader|false;