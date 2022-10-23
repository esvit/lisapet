const RESOURCE_PATH = 'assets';

export default
class ResourceManager {
  resources = {};

  atlases = {};

  constructor() {
    this.assetsPath = RESOURCE_PATH;
    this.emptyImage = new Image();
    this.emptyImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  }

  loadBatch(list) {
    const promises = [];
    for (const name of list) {
      const match = name.match(/\.\w+$/i);
      if (!match) {
        continue;
      }
      switch (match[0]) { // file extension
        case '.atlas':
          promises.push(this.loadAtlasByUrl(name));
          break;
        case '.json':
          promises.push(this.loadJsonByUrl(name));
          break;
        case '.wav':
        case '.mp3':
          promises.push(this.loadAudioByUrl(name));
          break;
        default:
        case '.webp':
        case '.png':
        case '.jpg':
        case '.jpeg':
          promises.push(this.loadImageByUrl(name));
      }
    }
    return Promise.all(promises);
  }

  loadImageByUrl(name) {
    this.resources[name] = this.emptyImage;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `${this.assetsPath}/${name}`;
      img.onerror = reject;
      img.onload = () => {
        this.resources[name] = img;
        resolve(img);
      };
    });
  }

  async loadAtlasByUrl(file) {
    this.resources[file] = {};
    const res = await fetch(`${this.assetsPath}/${file}`);
    const { texture, frames } = await res.json();
    if (!texture) {
      throw new Error(`Texture not found in atlas ${file}`);
    }
    this.resources[file] = res;
    this.atlases[file] = { texture, frames };
    await this.loadImageByUrl(texture);
    return this.resources[file];
  }

  async loadJsonByUrl(file) {
    this.resources[file] = {};
    const res = await fetch(`${this.assetsPath}/${file}`);
    this.resources[file] = await res.json();
    return this.resources[file];
  }

  loadAudioByUrl(name) {
    this.resources[name] = null;

    return new Promise(async (resolve) => {
      const resp = await fetch(`${this.assetsPath}/${name}`);
      const undecodedAudio = await resp.arrayBuffer();

      const audioCtx = new AudioContext();
      audioCtx.decodeAudioData(undecodedAudio, (data) => {
        data.play = () => {
          const audioCtx = new AudioContext();
          const source = audioCtx.createBufferSource();
          source.buffer = data;
          source.connect(audioCtx.destination);
          source.start(0);
        }
        this.resources[name] = data;
        resolve(this.resources[name]);
      });
    });
  }

  get(name) {
    return this.resources[name];
  }

  getByAtlas(name) {
    for (const atlasFile in this.atlases) {
      const { texture, frames } = this.atlases[atlasFile];
      if (frames[name]) {
        return [this.get(texture), ...frames[name]];
      }
    }
    return null;
  }
}
