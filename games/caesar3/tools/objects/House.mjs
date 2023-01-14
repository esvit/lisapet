import {
  INVENTORY_MAX
} from '../constants.mjs';
import BaseBuilding from './BaseBuilding.mjs';

export default
class House extends BaseBuilding  {
  inventory = new Array(INVENTORY_MAX);

  goods = {
    theater: 0,
    amphitheaterActor: 0,
    amphitheaterGladiator: 0,
    colosseumGladiator: 0,
    colosseumLion: 0,
    hippodrome: 0,
    school: 0,
    library: 0,
    academy: 0,
    barber: 0,
    clinic: 0,
    bathhouse: 0,
    hospital: 0,
    templeCeres: 0,
    templeNeptune: 0,
    templeMercury: 0,
    templeMars: 0,
    templeVenus: 0,
  };

  restoreByType(stream) {
    for (let i = 0; i < INVENTORY_MAX; i++) {
      this.inventory[i] = stream.readShort();
    }
    this.goods.theater = stream.readByte();
    this.goods.amphitheaterActor = stream.readByte();
    this.goods.amphitheaterGladiator = stream.readByte();
    this.goods.colosseumGladiator = stream.readByte();
    this.goods.colosseumLion = stream.readByte();
    this.goods.hippodrome = stream.readByte();
    this.goods.school = stream.readByte();
    this.goods.library = stream.readByte();
    this.goods.academy = stream.readByte();
    this.goods.barber = stream.readByte();
    this.goods.clinic = stream.readByte();
    this.goods.bathhouse = stream.readByte();
    this.goods.hospital = stream.readByte();
    this.goods.templeCeres = stream.readByte();
    this.goods.templeNeptune = stream.readByte();
    this.goods.templeMercury = stream.readByte();
    this.goods.templeMars = stream.readByte();
    this.goods.templeVenus = stream.readByte();

    this.noSpaceToExpand = stream.readByte();
    this.numFoods = stream.readByte();
    this.entertainment = stream.readByte();
    this.education = stream.readByte();
    this.health = stream.readByte();
    this.numGods = stream.readByte();
    this.devolveDelay = stream.readByte();
    this.evolveTextId = stream.readByte();
  }
}
